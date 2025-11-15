//@ts-nocheck
// ✅ Remove existing draggable zones if any
document.querySelectorAll('#ext_draggable-zone')?.forEach((zone) => zone.remove());

// Select the parent element
let PARENT = document.querySelector('#page-manager ytd-watch-flexy');
let targetChild = null;

if (!PARENT) {
  targetChild = document.querySelector(
    '#primary #header[class="style-scope ytd-rich-grid-renderer"]'
  )!;
  PARENT = targetChild?.parentElement;
}

// Create the draggable zone
const dropZone = document.createElement('div');
dropZone.id = 'ext_draggable-zone';
dropZone.textContent = 'Drag & Drop a JSON file or Click to Upload';
dropZone.style.cssText = `
    border: 1px solid rgba(255,255,255,0.2);
    padding: 20px;
    text-align: center;
    cursor: pointer;
    background-color: #212121;
    color: white;
    font-family: inherit;
    margin: 0.5rem 2rem;
    border-radius: 12px;
    width: -webkit-fill-available;
`;

// Create the hidden file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'application/json';
fileInput.style.display = 'none';

// Append elements
dropZone.appendChild(fileInput);
PARENT?.insertAdjacentElement('afterbegin', dropZone);

// Click event to open file picker
dropZone.addEventListener('click', () => fileInput.click());

// Handle file selection
fileInput.addEventListener('change', handleFile);

// Handle drag-and-drop functionality
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.style.borderColor = '#2ecc71';
  dropZone.style.color = '#2ecc71';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = 'rgba(255,255,255,0.2)';
  dropZone.style.color = 'white';
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.style.borderColor = '#3498db';
  dropZone.style.color = '#3498db';

  const file = event.dataTransfer?.files[0];
  if (file && file.type === 'application/json') {
    readFile(file);
  } else {
    alert('Please upload a valid JSON file.');
  }
});

// Function to handle file input change
function handleFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    console.error('No files selected');
    return;
  }

  readFile(file);
}

// Function to read the JSON file
function readFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string;
      const jsonData = JSON.parse(result);
      console.log('JSON Content:', jsonData);
      alert('JSON loaded successfully! Check the console.');
    } catch (error) {
      alert('Invalid JSON file.');
    }
  };

  reader.onerror = (e) => {
    console.error('File reading error:', e);
  };

  reader.readAsText(file);
}
