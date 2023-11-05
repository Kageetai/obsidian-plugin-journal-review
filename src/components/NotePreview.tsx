import { Keymap, MarkdownRenderer, TFile } from "obsidian";
import * as React from "preact";
import { useRef } from "preact/hooks";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app,
		view,
		settings: { previewLength, useCallout },
	} = useContext();
	const ref = useRef(null);

	(async () => {
		const content = await app.vault.cachedRead(note);
		const hasFrontMatter = content.startsWith("---");
		const frontMatterEnd = content.indexOf("---", 3) + 3;
		const sliceEnd = frontMatterEnd + previewLength;
		const slicedContent = content.slice(0, sliceEnd) + " ...";

		ref.current &&
			MarkdownRenderer.render(
				app,
				hasFrontMatter ? slicedContent : content,
				ref.current,
				note.path,
				view,
			);
	})();

	const onClick = (evt: MouseEvent) =>
		app.workspace.getLeaf(Keymap.isModEvent(evt)).openFile(note);

	if (useCallout) {
		return (
			<div class="callout" onClick={onClick}>
				<div class="callout-title">
					<div class="callout-title-inner">{note.basename}</div>
				</div>

				<div class="callout-content">
					<div ref={ref} />
				</div>
			</div>
		);
	}

	return (
		<div onClick={onClick}>
			<h4>{note.basename}</h4>

			<small className="markdown-rendered">
				<blockquote ref={ref} />
			</small>
		</div>
	);
};

export default NotePreview;
