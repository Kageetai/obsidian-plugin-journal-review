import { MarkdownRenderer, TFile } from "obsidian";
import * as React from "preact";
import { useEffect, useRef } from "preact/hooks";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app: { vault },
		view,
		settings: { previewLength },
	} = useContext();
	const ref = useRef<HTMLQuoteElement>(null);

	useEffect(() => {
		const read = async () => {
			let content = await vault.cachedRead(note);

			if (content.startsWith("---")) {
				// remove frontmatter
				const index = content.indexOf("---", 3);
				content = content.slice(index + 3, index + previewLength + 3);
			} else {
				content = content.slice(0, previewLength);
			}

			ref.current &&
				MarkdownRenderer.renderMarkdown(
					content + " ...",
					ref.current,
					note.path,
					view,
				);
		};

		read();
	}, [note]);

	return (
		<>
			<h4>{note.basename}</h4>

			<small className="markdown-rendered">
				<blockquote ref={ref} />
			</small>
		</>
	);
};

export default NotePreview;
