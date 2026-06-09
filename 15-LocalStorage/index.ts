interface Item {
  text: string;
  done: boolean;
}

const addItems = document.querySelector<HTMLFormElement>('.add-items');
const itemsList = document.querySelector<HTMLUListElement>('.plates');

if (!addItems || !itemsList) {
  throw new Error('Required DOM elements not found');
}

const items: Item[] = JSON.parse(
  localStorage.getItem('items') ?? '[]'
);

function addItem(this: HTMLFormElement, e: SubmitEvent): void {
  e.preventDefault();

  const input = this.querySelector<HTMLInputElement>('[name="item"]');

  if (!input || !input.value.trim()) return;

  const item: Item = {
    text: input.value.trim(),
    done: false,
  };

  items.push(item);

  populateList(items, itemsList);
  saveItems();

  this.reset();
}

function populateList(
  plates: readonly Item[],
  platesList: HTMLElement
): void {
  platesList.innerHTML = plates
    .map(
      (plate, i) => `
        <li>
          <input
            type="checkbox"
            data-index="${i}"
            id="item${i}"
            ${plate.done ? 'checked' : ''}
          />
          <label for="item${i}">
            ${plate.text}
          </label>
        </li>
      `
    )
    .join('');
}

function toggleDone(e: MouseEvent): void {
  const target = e.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const index = Number(target.dataset.index);

  if (Number.isNaN(index) || !items[index]) {
    return;
  }

  items[index].done = !items[index].done;

  saveItems();
  populateList(items, itemsList);
}

function saveItems(): void {
  localStorage.setItem('items', JSON.stringify(items));
}

addItems.addEventListener('submit', addItem);
itemsList.addEventListener('click', toggleDone);

populateList(items, itemsList);