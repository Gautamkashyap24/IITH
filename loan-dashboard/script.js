// Scroll Helper
function scrollToEngine() {
    document.getElementById('engine').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Profile Type Toggle Logic ---
    const profileRadios = document.querySelectorAll('input[name="profileType"]');
    const individualFields = document.getElementById('individualFields');
    const companyFields = document.getElementById('companyFields');
    
    // Form Inputs
    const indName = document.getElementById('indName');
    const indPan = document.getElementById('indPan');
    const indSalary = document.getElementById('indSalary');
    
    const compName = document.getElementById('compName');
    const compPan = document.getElementById('compPan');
    
    const docReqList = document.getElementById('docReqList');
    
    // Dynamic output IDs
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const scoreTitle = document.getElementById('scoreTitle');
    
    profileRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const profileType = e.target.value;
            
            if (profileType === 'individual') {
                // Show Individual Fields
                individualFields.classList.remove('hidden');
                companyFields.classList.add('hidden');
                
                // Toggle Requires
                indName.required = true;
                indPan.required = true;
                indSalary.required = true;
                compName.required = false;
                compPan.required = false;
                
                // Update text
                formTitle.innerText = "Applicant Details";
                formSubtitle.innerText = "Securely enter the primary borrower's information.";
                docReqList.innerHTML = `
                    <li><i class="ph-fill ph-check-circle text-primary"></i> Last 6 Months Bank Passbook</li>
                    <li><i class="ph-fill ph-info text-primary"></i> ITR Filing (Optional if income < 1L)</li>
                    <li><i class="ph-fill ph-check-circle text-primary"></i> PAN Card Copy</li>
                `;
                scoreTitle.innerText = "Consumer CIBIL";
                
            } else {
                // Show Company Fields
                individualFields.classList.add('hidden');
                companyFields.classList.remove('hidden');
                
                // Toggle Requires
                indName.required = false;
                indPan.required = false;
                indSalary.required = false;
                compName.required = true;
                compPan.required = true;
                
                // Update text
                formTitle.innerText = "Corporate Details";
                formSubtitle.innerText = "Securely enter the business entity's information.";
                docReqList.innerHTML = `
                    <li><i class="ph-fill ph-check-circle text-primary"></i> GST Filing Documents</li>
                    <li><i class="ph-fill ph-check-circle text-primary"></i> Corporate ITR Filing</li>
                    <li><i class="ph-fill ph-check-circle text-primary"></i> Company PAN Details</li>
                `;
                scoreTitle.innerText = "Commercial CMR/CIBIL";
            }
        });
    });


    // --- Dropzone Logic ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileListPreview = document.getElementById('fileListPreview');

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(fileInput.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFileSelect(fileInput.files);
        }
    });

    function handleFileSelect(files) {
        let fileNamesHTML = '<ul>';
        for (let i = 0; i < files.length; i++) {
            fileNamesHTML += `<li><i class="ph-fill ph-file-check"></i> ${files[i].name}</li>`;
        }
        fileNamesHTML += '</ul>';

        fileListPreview.innerHTML = `<div>Successfully uploaded ${files.length} document(s):</div> ${fileNamesHTML}`;
        fileListPreview.classList.remove('hidden');
        
        const uploadIcon = document.querySelector('.upload-icon-wrapper i');
        uploadIcon.className = 'ph-fill ph-files';
        
        const iconWrapper = document.querySelector('.upload-icon-wrapper');
        iconWrapper.style.backgroundColor = 'var(--clr-success-100)';
        iconWrapper.style.color = 'var(--clr-success-500)';
        iconWrapper.style.boxShadow = 'var(--shadow-green)';
        
        dropZone.style.borderColor = 'var(--clr-success-500)';
        dropZone.style.backgroundColor = 'rgba(236, 253, 245, 0.6)';
    }

    // --- Animation Tools ---
    function animateValue(obj, start, end, duration, formatter = (val) => val) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOutProgress * (end - start) + start);
            obj.innerHTML = formatter(current);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = formatter(end);
            }
        };
        window.requestAnimationFrame(step);
    }

    const formatRupees = (val) => '₹' + new Intl.NumberFormat('en-IN').format(val);
    const formatPercent = (val) => (val / 10).toFixed(1) + '%';


    // --- Simulation Flow ---
    const analyzeBtn = document.getElementById('analyzeBtn');
    const form = document.getElementById('loan-form');
    
    const outputPlaceholder = document.getElementById('outputPlaceholder');
    const outputContent = document.getElementById('outputContent');
    const gaugeProgress = document.getElementById('gaugeProgress');

    const cibilScoreDOM = document.getElementById('cibilScore');
    const approvedLimitDOM = document.getElementById('approvedLimit');
    const interestRateDOM = document.getElementById('interestRate');

    analyzeBtn.addEventListener('click', () => {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!fileInput.files.length) {
            alert('Please securely upload the required documents to proceed.');
            return;
        }

        // Set Loading State
        analyzeBtn.classList.add('loading');
        analyzeBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i><span class="btn-text">Running AI Models...</span>';

        if(window.innerWidth < 1080) {
            document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Simulate API Processing Time
        setTimeout(() => {
            analyzeBtn.classList.remove('loading');
            analyzeBtn.style.background = 'linear-gradient(135deg, var(--clr-success-600), var(--clr-success-400))';
            analyzeBtn.style.boxShadow = 'var(--shadow-green)';
            analyzeBtn.innerHTML = '<span class="btn-text">Analysis Complete</span><i class="ph-bold ph-check"></i>';

            outputPlaceholder.classList.add('fade-out');
            
            setTimeout(() => {
                outputPlaceholder.classList.add('hidden');
                outputContent.classList.remove('hidden');

                setTimeout(() => {
                    outputContent.classList.add('fade-in');

                    // Check profile type for logic
                    const isCompany = document.getElementById('profileCompany').checked;
                    
                    setTimeout(() => {
                        let targetScore;
                        let maxScore = 900;
                        let limitRate, interestRate;

                        if(isCompany) {
                            // Company Demo Values (CMR Score 1-10 scale where 1-3 is good, OR simulate high CIBIL 820)
                            // We will use 820 for visual gauge impressiveness
                            targetScore = 820;
                            limitRate = Math.min(parseInt(document.getElementById('loanAmount').value) || 5000000, 50000000); // 5Cr limit
                            interestRate = 85; // 8.5%
                        } else {
                            // Individual Demo Values
                            targetScore = 780;
                            limitRate = Math.min(parseInt(document.getElementById('loanAmount').value) || 500000, 5000000); // 50L limit
                            interestRate = 105; // 10.5%
                        }


                        animateValue(cibilScoreDOM, 300, targetScore, 2500);

                        const totalCircumference = 376.99;
                        const scorePercent = targetScore / maxScore; 
                        const offset = totalCircumference - (totalCircumference * scorePercent);
                        gaugeProgress.style.strokeDashoffset = offset;

                        animateValue(approvedLimitDOM, 0, limitRate, 2500, formatRupees);
                        animateValue(interestRateDOM, 0, interestRate, 2500, formatPercent);

                    }, 400);
                }, 50);

            }, 500);

        }, 2500);
    });
});
