export function fileTypeValidator(file: File, allowedTypes: string[]): boolean {

    if (!file)
        return false;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension)
        return false;

    return allowedTypes.indexOf(extension) != -1;

}

export function imageTypeValidator(image: File): boolean {
    return fileTypeValidator(image, ['jpg', 'jpeg', 'png', 'gif'])
}