import { Component, MarkdownRenderer, TFile } from "obsidian";
import * as React from "react";
import useContext from "../hooks/useContext";

interface Props {
	note: TFile;
}

const NotePreview = ({ note }: Props) => {
	const {
		app: { workspace, vault },
	} = useContext();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		vault.cachedRead(note).then((content) => {
			if (content.startsWith("---")) {
				// remove frontmatter
				const index = content.indexOf("---", 3);
				content = content.slice(index + 3, index + 103);
			} else {
				content = content.slice(0, 100);
			}

			console.log("content", content);

			ref.current &&
				MarkdownRenderer.renderMarkdown(
					content + " ...",
					ref.current,
					note.path,
					new Component()
				);
		});
	}, [note]);

	return (
		<>
			<div ref={ref} />

			<button onClick={() => workspace.getLeaf(false).openFile(note)}>
				read more
			</button>
		</>
	);
};

export default NotePreview;
