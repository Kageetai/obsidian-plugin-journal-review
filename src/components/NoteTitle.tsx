import type { TFile } from "obsidian";
import { useEffect, useReducer } from "preact/hooks";
import useContext from "../hooks/useContext";
import { resolveNoteTitle } from "../noteTitle";

const NoteTitle = ({ note }: { note: TFile }) => {
	const { app, settings } = useContext();
	const { useFrontmatterTitle } = settings;
	const [, refresh] = useReducer((version: number) => version + 1, 0);

	useEffect(() => {
		if (!useFrontmatterTitle) return;

		const event = app.metadataCache.on("changed", (file) => {
			if (file === note) refresh(undefined);
		});
		// Metadata may have been indexed between rendering and subscribing.
		refresh(undefined);
		return () => app.metadataCache.offref(event);
	}, [app, note, useFrontmatterTitle]);

	const frontmatterTitle: unknown = useFrontmatterTitle
		? app.metadataCache.getFileCache(note)?.frontmatter?.title
		: undefined;

	return (
		<>
			{resolveNoteTitle(note.basename, frontmatterTitle, useFrontmatterTitle)}
		</>
	);
};

export default NoteTitle;
