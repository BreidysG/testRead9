document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const questionOptions = document.querySelector('.question-options'); // Contenedor de las opciones de pregunta
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        { 
            question: "¿Qué le pedía el niño a su abuela insistentemente?", 
            answers: [
                "Una pelota de colores", 
                "Una paleta", 
                "Una bicicleta", 
                "Dulces"
            ], 
            correctAnswer: "Una pelota de colores" 
        },
        { 
            question: "¿Qué le regaló la abuela?", 
            answers: [
                "La pelota de colores", 
                "Una pelota de trapos", 
                "Un dulce de membrillo", 
                "Una fiesta"
            ], 
            correctAnswer: "Una pelota de trapos" 
        },
        { 
            question: "¿Qué le sucede a la pelota cuando juega el niño con ella?", 
            answers: [
                "Se queda quieta", 
                "Se vuelve una torta", 
                "Se convierte en un objeto animado", 
                "Se rompe"
            ], 
            correctAnswer: "Se rompe" 
        },
        { 
            question: "¿Qué pensó el niño cuando se cansó de jugar con la pelota de trapo?", 
            answers: [
                "Que quería la pelota de colores", 
                "Pegarle a la pelota era lindo, pero se cansaba de ir a buscarla siempre él", 
                "Mejor era comer helado", 
                "Fue el mejor regalo que recibió de la abuela"
            ], 
            correctAnswer: "Pegarle a la pelota era lindo, pero se cansaba de ir a buscarla siempre él" 
        },
        { 
            question: "¿Finalmente, qué sucedió con el niño y la abuela?", 
            answers: [
                "La abuela empezó a reír sentada en una silla y el niño se acostó sobre ella y se quedó dormido", 
                "La abuela se fue con el niño a comprar la pelota del almacén", 
                "La abuela empezó a reír y el niño se puso muy triste", 
                "El niño regresó a su casa y la abuela se quedó sola"
            ], 
            correctAnswer: "La abuela empezó a reír sentada en una silla y el niño se acostó sobre ella y se quedó dormido" 
        }
    ];
              
    // Función para contar las palabras en el texto
    function countWords(text) {
        return text.split(/\s+/).length;
    }

    // Función para calcular la velocidad de lectura
    function calculateReadingSpeed(startTime, endTime, wordCount) {
        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }

    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true; // Inicialmente, asumimos que al menos una opción está seleccionada

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) { // Si ninguna opción está seleccionada para alguna pregunta
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;
            
            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });
            
            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${calculateReadingSpeed(startTime, endTime, wordCount)}`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult}`;
            document.getElementById('results').innerHTML += '<p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p><p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>'
            ;

            
            
        }
    });

});
