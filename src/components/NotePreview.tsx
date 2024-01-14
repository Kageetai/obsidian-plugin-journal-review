import { Keymap, MarkdownRenderer, TFile } from "obsidian";
import * as React from "preact";
import { Ref, useRef } from "preact/hooks";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app,
		view,
		settings: { previewLength, useCallout, openInNewPane },
	} = useContext();
	const ref = useRef<HTMLDivElement | HTMLQuoteElement>(null);

	(async () => {
		const slicedContent = (await app.vault.cachedRead(note))
			// remove frontmatter
			.replace(/---.*?---/s, "")
			// restrict to chosen preview length
			.substring(0, previewLength);

		if (ref.current) {
			// clear the element before rendering, otherwise it will append
			ref.current.innerHTML = "";

			MarkdownRenderer.render(
				app,
				slicedContent,
				ref.current,
				note.path,
				view,
			);
		}
	})();

	const onClick = (evt: MouseEvent) => {
		const isMiddleButton = evt.button === 1;
		const newLeaf =
			Keymap.isModEvent(evt) || isMiddleButton || openInNewPane;

		return app.workspace.getLeaf(newLeaf).openFile(note);
	};

	if (useCallout) {
		return (
			<div class="callout" onMouseUp={onClick}>
				<div class="callout-title">
					<div class="callout-title-inner">{note.basename}</div>
				</div>

				<div class="callout-content" ref={ref as Ref<HTMLDivElement>} />
			</div>
		);
	}

	return (
		<div onMouseUp={onClick}>
			<h4>{note.basename}</h4>

			<small className="markdown-rendered">
				<blockquote ref={ref as Ref<HTMLQuoteElement>} />
			</small>
		</div>
	);
};

export default NotePreview;
