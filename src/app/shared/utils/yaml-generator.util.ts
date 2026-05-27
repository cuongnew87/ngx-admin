export function normalizeName(
  value: string
): string {

  return (value || '')

    .toLowerCase()

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .replace(/[^a-z0-9]+/g, '-')

    .replace(/^-+|-+$/g, '')

    .replace(/-{2,}/g, '-');
}

export function parseDockerImage(
  image: string
): any {

  const value =
    (image || '').trim();

  if (!value) {

    return {
      valid: false
    };
  }

  // support registry:port

  const lastColonIndex =
    value.lastIndexOf(':');

  if (
    lastColonIndex <= 0 ||
    lastColonIndex === value.length - 1
  ) {

    return {
      valid: false
    };
  }

  const repository =
    value.substring(0, lastColonIndex);

  const tag =
    value.substring(lastColonIndex + 1);

  const repositoryRegex =
    /^[a-zA-Z0-9._:/-]+$/;

  const tagRegex =
    /^[a-zA-Z0-9._-]+$/;

  if (
    !repositoryRegex.test(repository) ||
    !tagRegex.test(tag)
  ) {

    return {
      valid: false
    };
  }

  return {

    valid: true,

    repository,

    tag
  };
}