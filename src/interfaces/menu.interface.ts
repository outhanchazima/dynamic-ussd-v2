export interface Menu {
  text: string;
  options: string[];
  // isInputRequired: boolean;
  // inputValue: string;
  next: (selectedOption: string) => Menu;
}
