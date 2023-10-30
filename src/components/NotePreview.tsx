import { Keymap, MarkdownRenderer, TFile } from "obsidian";
import * as React from "preact";
import { useEffect, useRef } from "preact/hooks";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app,
		view,
		settings: { previewLength },
	} = useContext();
	const ref = useRef(null);

	useEffect(() => {
		const read = async () => {
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
		};

		read();
	}, [note]);

	return (
		<div
			class="callout"
			onClick={(evt) =>
				app.workspace.getLeaf(Keymap.isModEvent(evt)).openFile(note)
			}
		>
			<div class="callout-title">
				<div class="callout-title-inner">{note.basename}</div>
			</div>

			<div class="callout-content">
				<div ref={ref} />
			</div>
		</div>
	);
};

export default NotePreview;
