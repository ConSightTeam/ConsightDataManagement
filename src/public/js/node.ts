function nodeTypeRadioChanged(changed: HTMLElement): void {
    let isDynamic: boolean = changed.id === 'dynamic';

    (document.getElementById('x') as HTMLInputElement).disabled = isDynamic;
    (document.getElementById('y') as HTMLInputElement).disabled = isDynamic;
}