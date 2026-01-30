// Data storage
let cvData = {
    personal: { name: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', photo: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: []
};

// Initialize
window.onload = async () => {
    try {
        const response = await fetch('cv-data.json');
        if (response.ok) {
            cvData = await response.json();
        }
    } catch (e) {
        console.log('Could not load cv-data.json, use Load Data button');
    }
    loadDataToForm();
    updatePDFTemplate();
};

function loadDataToForm() {
    document.getElementById('name').value = cvData.personal.name;
    document.getElementById('job-title').value = cvData.personal.jobTitle;
    document.getElementById('email').value = cvData.personal.email;
    document.getElementById('phone').value = cvData.personal.phone;
    document.getElementById('location').value = cvData.personal.location;
    document.getElementById('photo').value = cvData.personal.photo;
    document.getElementById('summary').value = cvData.personal.summary;

    renderExperienceList();
    renderEducationList();
    renderSkillsList();
    renderProjectsList();
}

function switchTab(tabName, e) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    if (e && e.target) {
        e.target.classList.add('active');
    }
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Debounce timer for PDF refresh
let pdfRefreshTimer = null;

function schedulePDFRefresh() {
    if (pdfRefreshTimer) {
        clearTimeout(pdfRefreshTimer);
    }
    pdfRefreshTimer = setTimeout(() => {
        updatePDFTemplate();
    }, 300);
}

function updatePDFTemplate() {
    // Update PDF template elements
    document.getElementById('pdf-name').textContent = cvData.personal.name || 'Your Name';
    document.getElementById('pdf-title').textContent = cvData.personal.jobTitle || 'Job Title';
    document.getElementById('pdf-summary').textContent = cvData.personal.summary || '';

    // Update photo
    const photoEl = document.getElementById('pdf-photo');
    if (cvData.personal.photo) {
        photoEl.innerHTML = `<img src="${cvData.personal.photo}" alt="Photo">`;
    } else {
        const names = cvData.personal.name.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
        photoEl.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:24px;color:white;font-weight:600;">${initials || 'XW'}</span>`;
    }

    // Contact bar (using monochrome Unicode symbols)
    let contactHTML = '';
    if (cvData.personal.email) contactHTML += `<span>✉ ${cvData.personal.email}</span>`;
    if (cvData.personal.linkedin) contactHTML += `<span>⛓ ${cvData.personal.linkedin}</span>`;
    if (cvData.personal.location) contactHTML += `<span>⚲ ${cvData.personal.location}</span>`;
    document.getElementById('pdf-contact').innerHTML = contactHTML;

    // Skills - now with categories
    if (Array.isArray(cvData.skills) && cvData.skills.length > 0) {
        if (typeof cvData.skills[0] === 'object' && cvData.skills[0].category) {
            document.getElementById('pdf-skills-items').innerHTML =
                cvData.skills.map(skill => `
                    <div class="skill-row">
                        <span class="skill-category">${skill.category}:</span>
                        <span class="skill-items">${skill.items}</span>
                    </div>
                `).join('');
        } else {
            document.getElementById('pdf-skills-items').innerHTML =
                cvData.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('');
        }
    }

    // Education
    document.getElementById('pdf-education-items').innerHTML = cvData.education.map(edu => `
        <div class="edu-item">
            <div class="edu-degree">${edu.degree}</div>
            <div class="edu-institution">${edu.institution}${edu.location ? ', ' + edu.location : ''}</div>
        </div>
    `).join('');

    // Experience - original style with date below company
    document.getElementById('pdf-experience-items').innerHTML = cvData.experience.map(exp => {
        const bullets = exp.description.split('\n').filter(line => line.trim()).map(line => {
            const cleaned = line.trim().replace(/^[•\-\*]\s*/, '');
            return `<li>${cleaned}</li>`;
        }).join('');
        return `
            <div class="cv-item">
                <div class="cv-item-title">${exp.title}</div>
                <div class="cv-item-subtitle">${exp.company}</div>
                <div class="cv-item-date">${exp.start} - ${exp.end}${exp.location ? ' • ' + exp.location : ''}</div>
                ${bullets ? `<div class="cv-item-description"><ul>${bullets}</ul></div>` : ''}
            </div>
        `;
    }).join('');

    // Projects - only show those with display: true (or display not set for backwards compatibility)
    document.getElementById('pdf-projects-items').innerHTML = cvData.projects.filter(proj => proj.display !== false).map(proj => {
        const bullets = proj.description.split('\n').filter(line => line.trim()).map(line => {
            const cleaned = line.trim().replace(/^[•\-\*]\s*/, '');
            return `<li>${cleaned}</li>`;
        }).join('');
        return `
            <div class="cv-item">
                <div class="cv-item-title">${proj.name}</div>
                <div class="cv-project-tech">${proj.tech}</div>
                ${bullets ? `<div class="cv-item-description"><ul>${bullets}</ul></div>` : ''}
            </div>
        `;
    }).join('');
}

function updatePreview() {
    cvData.personal.name = document.getElementById('name').value;
    cvData.personal.jobTitle = document.getElementById('job-title').value;
    cvData.personal.email = document.getElementById('email').value;
    cvData.personal.phone = document.getElementById('phone').value;
    cvData.personal.location = document.getElementById('location').value;
    cvData.personal.photo = document.getElementById('photo').value;
    cvData.personal.summary = document.getElementById('summary').value;

    schedulePDFRefresh();
}

// Experience functions
function addExperience() {
    const exp = {
        title: document.getElementById('exp-title').value,
        company: document.getElementById('exp-company').value,
        location: document.getElementById('exp-location').value,
        start: document.getElementById('exp-start').value,
        end: document.getElementById('exp-end').value,
        description: document.getElementById('exp-description').value
    };

    if (!exp.title || !exp.company) {
        alert('Please fill in at least the job title and company');
        return;
    }

    cvData.experience.push(exp);

    document.getElementById('exp-title').value = '';
    document.getElementById('exp-company').value = '';
    document.getElementById('exp-location').value = '';
    document.getElementById('exp-start').value = '';
    document.getElementById('exp-end').value = '';
    document.getElementById('exp-description').value = '';

    renderExperienceList();
    schedulePDFRefresh();
}

function removeExperience(index) {
    cvData.experience.splice(index, 1);
    renderExperienceList();
    schedulePDFRefresh();
}

function renderExperienceList() {
    const list = document.getElementById('experience-list');
    list.innerHTML = cvData.experience.map((exp, index) => `
        <div class="item-entry">
            <button class="danger" onclick="removeExperience(${index})">Remove</button>
            <strong>${exp.title}</strong> at ${exp.company}<br>
            <small>${exp.start} - ${exp.end}</small>
        </div>
    `).join('');
}

// Education functions
function addEducation() {
    const edu = {
        degree: document.getElementById('edu-degree').value,
        institution: document.getElementById('edu-institution').value,
        location: document.getElementById('edu-location').value,
        year: document.getElementById('edu-year').value,
        info: document.getElementById('edu-info').value
    };

    if (!edu.degree || !edu.institution) {
        alert('Please fill in at least the degree and institution');
        return;
    }

    cvData.education.push(edu);

    document.getElementById('edu-degree').value = '';
    document.getElementById('edu-institution').value = '';
    document.getElementById('edu-location').value = '';
    document.getElementById('edu-year').value = '';
    document.getElementById('edu-info').value = '';

    renderEducationList();
    schedulePDFRefresh();
}

function removeEducation(index) {
    cvData.education.splice(index, 1);
    renderEducationList();
    schedulePDFRefresh();
}

function renderEducationList() {
    const list = document.getElementById('education-list');
    list.innerHTML = cvData.education.map((edu, index) => `
        <div class="item-entry">
            <button class="danger" onclick="removeEducation(${index})">Remove</button>
            <strong>${edu.degree}</strong><br>
            ${edu.institution} • ${edu.year}
        </div>
    `).join('');
}

// Skills functions
function addSkill() {
    const skill = document.getElementById('skill-item').value;

    if (!skill) {
        alert('Please enter a skill');
        return;
    }

    // Support both old format (string) and new format (object)
    if (skill.includes(':')) {
        const [category, items] = skill.split(':').map(s => s.trim());
        cvData.skills.push({ category, items });
    } else {
        cvData.skills.push(skill);
    }
    document.getElementById('skill-item').value = '';

    renderSkillsList();
    schedulePDFRefresh();
}

function removeSkill(index) {
    cvData.skills.splice(index, 1);
    renderSkillsList();
    schedulePDFRefresh();
}

function renderSkillsList() {
    const list = document.getElementById('skills-list');
    list.innerHTML = cvData.skills.map((skill, index) => {
        const display = typeof skill === 'object' ? `${skill.category}: ${skill.items}` : skill;
        return `
            <div class="item-entry">
                <button class="danger" onclick="removeSkill(${index})">Remove</button>
                ${display}
            </div>
        `;
    }).join('');
}

// Projects functions
function addProject() {
    const proj = {
        name: document.getElementById('proj-name').value,
        tech: document.getElementById('proj-tech').value,
        description: document.getElementById('proj-description').value
    };

    if (!proj.name) {
        alert('Please fill in at least the project name');
        return;
    }

    cvData.projects.push(proj);

    document.getElementById('proj-name').value = '';
    document.getElementById('proj-tech').value = '';
    document.getElementById('proj-description').value = '';

    renderProjectsList();
    schedulePDFRefresh();
}

function removeProject(index) {
    cvData.projects.splice(index, 1);
    renderProjectsList();
    schedulePDFRefresh();
}

function renderProjectsList() {
    const list = document.getElementById('projects-list');
    list.innerHTML = cvData.projects.map((proj, index) => `
        <div class="item-entry">
            <button class="secondary" onclick="editProject(${index})" style="right: 70px;">Edit</button>
            <button class="danger" onclick="removeProject(${index})">Remove</button>
            <strong>${proj.name}</strong><br>
            <small>${proj.tech}</small>
        </div>
    `).join('');
}

function editProject(index) {
    const proj = cvData.projects[index];
    document.getElementById('proj-name').value = proj.name;
    document.getElementById('proj-tech').value = proj.tech;
    document.getElementById('proj-description').value = proj.description;
    cvData.projects.splice(index, 1);
    renderProjectsList();
    schedulePDFRefresh();
}

// Data management
function saveData() {
    const dataStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                cvData = JSON.parse(event.target.result);
                loadDataToForm();
                schedulePDFRefresh();
                alert('Data loaded successfully!');
            } catch (error) {
                alert('Error loading data: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data?')) {
        cvData = {
            personal: { name: '', jobTitle: '', email: '', phone: '', location: '', photo: '', summary: '' },
            experience: [],
            education: [],
            skills: [],
            projects: []
        };
        loadDataToForm();
        schedulePDFRefresh();
    }
}

function downloadPDF() {
    window.print();
}
