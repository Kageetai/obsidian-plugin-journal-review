import { Component, MarkdownRenderer, TFile } from "obsidian";
import * as React from "react";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app: { workspace, vault },
		settings: { previewLength },
	} = useContext();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
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
					new Component()
				);
		};

		read();
	}, [note]);

	return (
		<>
			<h4>{note.basename} </h4>

			<div ref={ref} />

			<small>
				<a
					href="#"
					onClick={() => workspace.getLeaf(false).openFile(note)}
				>
					read more...
				</a>
			</small>
		</>
	);
};

export default NotePreview;
