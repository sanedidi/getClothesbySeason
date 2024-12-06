export const importImages = (requireContext) => {
    return requireContext
        .keys()
        .map((key, index) => ({
            id: index + 1,
            photo: requireContext(key).default,
        }));
};