export const resolveNoteTitle = (
	basename: string,
	frontmatterTitle: unknown,
	useFrontmatterTitle: boolean,
): string => {
	if (useFrontmatterTitle && typeof frontmatterTitle === "string") {
		return frontmatterTitle.trim() || basename;
	}
	return basename;
};
