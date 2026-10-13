import { Keymap, MarkdownRenderer, TFile } from "obsidian";
import { Ref } from "preact";
import { useRef } from "preact/hooks";
import useContext from "../hooks/useContext";
import NoteTitle from "./NoteTitle";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const { app, view, settings } = useContext();
	const ref = useRef<HTMLDivElement | HTMLQuoteElement>(null);

	void (async () => {
		const slicedContent = (await app.vault.cachedRead(note))
			// remove frontmatter
			.replace(/---.*?---/s, "")
			// remove custom regex
			.replace(new RegExp(settings.noteMarkdownRegex, "sg"), "")
			// restrict to chosen preview length
			.substring(0, settings.previewLength);

		if (ref.current) {
			// clear the element before rendering, otherwise it will append
			ref.current.innerHTML = "";

			await MarkdownRenderer.render(
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
			Keymap.isModEvent(evt) || isMiddleButton || settings.openInNewPane;

		void app.workspace.getLeaf(newLeaf).openFile(note);
	};

	if (settings.useCallout) {
		return (
			<div className="callout" onMouseUp={onClick}>
				{settings.showNoteTitle && (
					<div className="callout-title">
						<div className="callout-title-inner">
							<NoteTitle note={note} />
						</div>
					</div>
				)}

				<div className="callout-content" ref={ref as Ref<HTMLDivElement>} />
			</div>
		);
	}

	return (
		<div onMouseUp={onClick}>
			{settings.showNoteTitle && (
				<h4>
					<NoteTitle note={note} />
				</h4>
			)}

			<small className="markdown-rendered">
				{settings.useQuote ? (
					<blockquote ref={ref as Ref<HTMLQuoteElement>} />
				) : (
					<div ref={ref as Ref<HTMLDivElement>} />
				)}
			</small>
		</div>
	);
};

export default NotePreview;
