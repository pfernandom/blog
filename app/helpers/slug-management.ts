export function slugToPage(path: string, date: Date) {
    const slug = path.replace(/(\d{1,2})_/ig, `${date.getMonth() + 1}/`);
    return slug;
  }