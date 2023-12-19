export function setItem(key, value) {
    const storedValue = JSON.stringify(value);
    localStorage.setItem(key, storedValue);
}

export function getItem(key) {
    const item = localStorage.getItem(key);
    return JSON.parse(item);
}

export function removeItem(key) {
    localStorage.removeItem(key);
}