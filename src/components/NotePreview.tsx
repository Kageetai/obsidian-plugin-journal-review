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
			let content = await app.vault.cachedRead(note);

			if (content.startsWith("---")) {
				// remove frontmatter
				const index = content.indexOf("---", 3);
				content = content.slice(index + 3, index + previewLength + 3);
			} else {
				content = content.slice(0, previewLength);
			}

			ref.current &&
				MarkdownRenderer.render(
					app,
					content + " ...",
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
