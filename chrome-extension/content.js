const button = document.createElement('button');
button.textContent = 'Greet me!'
if (confirm("Create Summary for the Article below")) {
    window.open(`http://localhost:3000?url=${window.location.href}`);
}