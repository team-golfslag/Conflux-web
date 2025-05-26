/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevenshteinDistance(search: string, option: string) {
  const { min } = Math;
  const m = [];
  let i;
  let j;
  const lowerOption = option.toLowerCase();

  if (search === option) return 1;

  if (lowerOption.startsWith(search)) return 1.25;
  if (lowerOption.includes(search)) return 1.5;

  if (!(search && lowerOption)) return (lowerOption || search).length;

  for (i = 0; i <= lowerOption.length; m[i] = [i++]);
  for (j = 0; j <= search.length; m[0][j] = j++);

  for (i = 1; i <= lowerOption.length; i++) {
    for (j = 1; j <= search.length; j++) {
      m[i][j] =
        lowerOption.charAt(i - 1) === search.charAt(j - 1)
          ? m[i - 1][j - 1]
          : (m[i][j] = min(
              m[i - 1][j - 1] + 1,
              min(m[i][j - 1] + 1, m[i - 1][j] + 1),
            ));
    }
  }

  return m[option.length][search.length] + 3;
}
