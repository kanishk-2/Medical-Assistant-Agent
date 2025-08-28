document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements from the HTML
    const symptomInput = document.getElementById('symptom-input');
    const submitButton = document.getElementById('submit-button');
    const getTreatmentButton = document.getElementById('get-treatment-button');
    const getCausesButton = document.getElementById('get-causes-button');
    const loadingIndicator = document.getElementById('loading');
    const llmLoading = document.getElementById('llm-loading');
    const responseContainer = document.getElementById('response');
    const responseText = document.getElementById('response-text');
    const llmFeaturesSection = document.getElementById('llm-features-section');
    const treatmentSuggestions = document.getElementById('treatment-suggestions');
    const causesInfo = document.getElementById('causes-info');

    // API key and URL for the Gemini API
    const apiKey = " your_api_key_here "; // Replace with your actual API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

    // Event listener for the main "Check Symptom" button
    submitButton.addEventListener('click', () => {
        const symptom = symptomInput.value.trim();
        if (symptom) {
            processSymptom(symptom);
        } else {
            responseText.textContent = "Please enter a symptom.";
            responseContainer.classList.remove('hidden');
            llmFeaturesSection.classList.add('hidden');
        }
    });

    // Event listener for the "Get Next Steps" button
    getTreatmentButton.addEventListener('click', () => {
        const symptom = symptomInput.value.trim();
        const category = responseText.dataset.category;
        if (symptom && category) {
            getTreatmentSuggestions(symptom, category);
        }
    });

    // Event listener for the "What are the possible causes?" button
    getCausesButton.addEventListener('click', () => {
        const symptom = symptomInput.value.trim();
        const category = responseText.dataset.category;
        if (symptom && category) {
            getCausesInformation(symptom);
        }
    });

    // Function to process the initial symptom and classify it
    async function processSymptom(symptom) {
        // Show loading spinner and hide previous results
        loadingIndicator.classList.remove('hidden');
        responseContainer.classList.add('hidden');
        llmFeaturesSection.classList.add('hidden');
        treatmentSuggestions.classList.add('hidden');
        causesInfo.classList.add('hidden');

        try {
            const category = await classifySymptom(symptom);
            
            let finalAnswer = '';
            // Determine the final message based on the classification
            switch (category) {
                case 'General':
                    finalAnswer = `'${symptom}': seems general: directing you to the general ward for consulting a doctor`;
                    break;
                case 'Emergency':
                    finalAnswer = `'${symptom}': It is a Medical Emergency: seeking immediate help`;
                    break;
                case 'Mental Health':
                    finalAnswer = `'${symptom}': seems like a mental health issue: talk to our counsellor`;
                    break;
                default:
                    finalAnswer = `'${symptom}': unable to classify. Please consult a doctor.`;
                    break;
            }

            // Update the UI with the result and show the new buttons
            responseText.textContent = finalAnswer;
            responseText.dataset.category = category;
            llmFeaturesSection.classList.remove('hidden');
        } catch (error) {
            console.error("Error processing symptom:", error);
            responseText.textContent = "Sorry, an error occurred. Please try again later.";
        } finally {
            // Hide the main loading spinner
            loadingIndicator.classList.add('hidden');
            responseContainer.classList.remove('hidden');
        }
    }

    // Function to call the Gemini API to classify the symptom
    async function classifySymptom(symptom) {
        const prompt = `You are a helpful Medical Assistant. Classify the symptom below into one of the categories:
                        -General
                        -Emergency
                        -Mental Health
                        Symptom: ${symptom}
                        Respond only with one word: General, Emergency, or Mental Health.
                        Example: input: I have a fever, Output: General`;

        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        return await callGeminiAPI(payload).then(response => response.candidates[0].content.parts[0].text.trim());
    }

    // Function to get treatment suggestions from the LLM
    async function getTreatmentSuggestions(symptom, category) {
        llmLoading.classList.remove('hidden');
        treatmentSuggestions.classList.add('hidden');
        causesInfo.classList.add('hidden');
        
        const prompt = `You are a helpful Medical Assistant. Given the symptom: '${symptom}' and its classification as '${category}', provide a brief, bulleted list of general next steps or a course of action. DO NOT provide medical advice. State that the user should consult a professional.
        Example for 'General' classification:
        - Consult a medical professional.
        - Rest and stay hydrated.
        - Use over-the-counter medication as directed by a doctor.`;
        
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await callGeminiAPI(payload);
            const text = response.candidates[0].content.parts[0].text.trim();
            const listItems = text.split('-').filter(item => item.trim() !== '').map(item => `<li>${item.trim()}</li>`).join('');
            treatmentSuggestions.innerHTML = `<p class="font-semibold">Suggested Next Steps:</p><ul>${listItems}</ul>`;
            treatmentSuggestions.classList.remove('hidden');
        } catch (error) {
            treatmentSuggestions.innerHTML = `<p class="text-red-500">Sorry, an error occurred while getting suggestions.</p>`;
            treatmentSuggestions.classList.remove('hidden');
        } finally {
            llmLoading.classList.add('hidden');
        }
    }

    // Function to get possible causes from the LLM
    async function getCausesInformation(symptom) {
        llmLoading.classList.remove('hidden');
        treatmentSuggestions.classList.add('hidden');
        causesInfo.classList.add('hidden');
        
        const prompt = `You are a helpful Medical Assistant. Given the symptom: '${symptom}', provide a brief, introductory paragraph and a bulleted list of a few common, possible causes. DO NOT provide medical advice. State that the user should consult a professional.`;

        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await callGeminiAPI(payload);
            const text = response.candidates[0].content.parts[0].text.trim();
            // Split the text into the intro paragraph and the bulleted list
            const parts = text.split(/\n- /);
            const intro = `<p class="font-semibold mb-2">Possible Causes:</p><p>${parts[0]}</p>`;
            const listItems = parts.slice(1).map(item => `<li>${item.trim()}</li>`).join('');
            causesInfo.innerHTML = `${intro}<ul>${listItems}</ul>`;
            causesInfo.classList.remove('hidden');
        } catch (error) {
            causesInfo.innerHTML = `<p class="text-red-500">Sorry, an error occurred while getting causes.</p>`;
            causesInfo.classList.remove('hidden');
        } finally {
            llmLoading.classList.add('hidden');
        }
    }

    // Generic function to handle API calls with exponential backoff
    async function callGeminiAPI(payload) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        let retries = 0;
        const maxRetries = 3;
        while (retries < maxRetries) {
            try {
                const response = await fetch(`${apiUrl}?key=${apiKey}`, requestOptions);
                if (!response.ok) {
                    if (response.status === 429) {
                        const delay = Math.pow(2, retries) * 1000;
                        console.warn(`API rate limit exceeded. Retrying in ${delay}ms...`);
                        await new Promise(res => setTimeout(res, delay));
                        retries++;
                        continue;
                    }
                    throw new Error(`API request failed with status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
        }
        throw new Error("Failed to get a response from the Gemini API after multiple retries.");
    }
});