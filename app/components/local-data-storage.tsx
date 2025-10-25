export function LoadDatalocally({keyName}: {keyName: string}): string | null {
    const loadedData = localStorage.getItem(keyName);
    if (loadedData === null) {
        console.log(`No Local Data Found for Key - ${keyName}`)
        return null;
    }
    console.log(`Loading Data Locally: Key - ${keyName}, Value - ${loadedData}`)
    return loadedData;
}

export function SaveDataLocally(keyName: string, valueToSave: string) {
    console.log(`Saving Data Locally: Key - ${keyName}, Value - ${valueToSave}`)
    localStorage.setItem(keyName, valueToSave);
}

export function ClearLocalStorage() {
    console.log("clearing the local storage")
    localStorage.clear()
}

export function CheckPlayedToday(localCheck: string): boolean {
    if (localCheck === 'true') {
        return true
    }
    else {
        return false
    }
}