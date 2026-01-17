// Scroll Animation - Reveal elements on scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document.querySelectorAll('section, .card, .blog-post, .exercise-card, .mobility-card').forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

// Initialize scroll animations when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// Habit Tracker Functionality
const habitButtons = document.querySelectorAll('.habit-btn');
const trackerResult = document.getElementById('tracker-result');

habitButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove selected class from all buttons
    habitButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Get habit name
    const habit = button.getAttribute('data-habit');
    const habitText = button.textContent;
    
    // Show result
    trackerResult.innerHTML = `
      <h3>Gekozen gewoonte: ${habitText}</h3>
      <p><strong>Volgende stappen:</strong></p>
      <ol style="padding-left: 25px; margin-top: 10px; color: #475569;">
        <li>Schrijf je doel op en hang het op een zichtbare plek</li>
        <li>Kies een specifiek moment van de dag voor deze gewoonte</li>
        <li>Vertel iemand over je doel voor extra motivatie</li>
        <li>Vink elke dag af dat je het gedaan hebt</li>
        <li>Vier je succes na een week</li>
      </ol>
      <p style="margin-top: 15px; font-weight: 500; color: #000000 !important;">Begin vandaag met deze gewoonte.</p>
    `;
    trackerResult.classList.add('show');
    
    // Save to localStorage
    localStorage.setItem('selectedHabit', habit);
    localStorage.setItem('selectedHabitText', habitText);
    localStorage.setItem('startDate', new Date().toISOString());
  });
});

// Load saved habit on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedHabit = localStorage.getItem('selectedHabit');
  if (savedHabit) {
    const savedButton = document.querySelector(`[data-habit="${savedHabit}"]`);
    if (savedButton) {
      savedButton.classList.add('selected');
      const savedHabitText = localStorage.getItem('selectedHabitText');
      const startDate = new Date(localStorage.getItem('startDate'));
      const daysAgo = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
      
      trackerResult.innerHTML = `
        <h3>Je gewoonte: ${savedHabitText}</h3>
        <p style="color: #475569;">Je bent ${daysAgo} dag${daysAgo !== 1 ? 'en' : ''} geleden begonnen.</p>
        <p style="margin-top: 10px; font-weight: 500; color: #0c4a6e;">Blijf doorgaan met je goede werk.</p>
      `;
      trackerResult.classList.add('show');
    }
  }
});

// Smooth scroll for any future internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formResponse = document.getElementById('formResponse');
    const name = document.getElementById('name').value;
    
    // Simulate form submission
    formResponse.className = 'form-response success';
    formResponse.textContent = `Bedankt ${name}! We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.`;
    
    // Reset form
    contactForm.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formResponse.style.display = 'none';
    }, 5000);
  });
}

// Lifestyle Guide Functionality
const healthQuiz = document.getElementById('healthQuiz');
if (healthQuiz) {
  const questions = document.querySelectorAll('.question');
  const totalQuestions = questions.length;
  let currentQuestionIndex = 0;
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressFill = document.getElementById('progressFill');
  const currentQuestionSpan = document.getElementById('currentQuestion');
  const totalQuestionsSpan = document.getElementById('totalQuestions');
  
  totalQuestionsSpan.textContent = totalQuestions;
  
  function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
  }
  
  function showQuestion(index) {
    questions.forEach((q, i) => {
      q.classList.toggle('active', i === index);
    });
    
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    nextBtn.style.display = index === totalQuestions - 1 ? 'none' : 'block';
    submitBtn.style.display = index === totalQuestions - 1 ? 'block' : 'none';
    
    updateProgress();
  }
  
  function isQuestionAnswered(index) {
    const question = questions[index];
    const radios = question.querySelectorAll('input[type="radio"]');
    return Array.from(radios).some(radio => radio.checked);
  }
  
  nextBtn.addEventListener('click', () => {
    if (isQuestionAnswered(currentQuestionIndex)) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      alert('Kies een antwoord om door te gaan.');
    }
  });
  
  prevBtn.addEventListener('click', () => {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  });
  
  healthQuiz.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!isQuestionAnswered(currentQuestionIndex)) {
      alert('Beantwoord de laatste vraag om je resultaten te zien.');
      return;
    }
    
    // Collect answers
    const formData = new FormData(healthQuiz);
    const answers = {
      workType: formData.get('workType'),
      schedule: formData.get('schedule'),
      activity: formData.get('activity'),
      sleep: formData.get('sleep'),
      nutrition: formData.get('nutrition'),
      time: formData.get('time'),
      challenge: formData.get('challenge'),
      travel: formData.get('travel')
    };
    
    // Generate personalized advice
    generatePersonalizedAdvice(answers);
    
    // Show results
    document.getElementById('questionnaire').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  function generatePersonalizedAdvice(answers) {
    const intro = document.getElementById('personalizedIntro');
    const adviceContainer = document.getElementById('personalizedAdvice');
    
    // Generate intro based on profile
    let introText = `Op basis van jouw antwoorden heb ik een persoonlijk gezondheidsplan voor je samengesteld. `;
    
    if (answers.workType === 'office' || answers.workType === 'remote') {
      introText += `Je werk is overwegend zittend, dus beweging en ergonomie zijn essentieel. `;
    } else if (answers.workType === 'physical') {
      introText += `Je werk is fysiek zwaar, dus herstel en blessurepreventie zijn cruciaal. `;
    } else if (answers.workType === 'student') {
      introText += `Als student heb je te maken met beperkt budget en onregelmatige schema's. `;
    }
    
    if (answers.schedule === 'night') {
      introText += `Je nachtdiensten vragen extra aandacht voor je slaapkwaliteit en bioritme. `;
    } else if (answers.schedule === 'irregular') {
      introText += `Je wisselende schema vraagt om flexibele gezondheidsgewoontes. `;
    }
    
    if (answers.time === 'minimal') {
      introText += `Met weinig tijd focus ik op snelle, effectieve interventies. `;
    } else if (answers.time === 'flexible') {
      introText += `Je hebt tijd om aan je gezondheid te werken - mooi! `;
    }
    
    intro.textContent = introText;
    
    // Generate personalized advice sections
    let adviceHTML = '';
    
    // Movement advice
    adviceHTML += generateMovementAdvice(answers);
    
    // Nutrition advice
    adviceHTML += generateNutritionAdvice(answers);
    
    // Sleep advice
    adviceHTML += generateSleepAdvice(answers);
    
    // Stress/Mental health advice
    adviceHTML += generateMentalHealthAdvice(answers);
    
    // Challenge-specific advice
    adviceHTML += generateChallengeAdvice(answers);
    
    // Travel advice if applicable
    if (answers.travel === 'frequent' || answers.travel === 'constant') {
      adviceHTML += generateTravelAdvice(answers);
    }
    
    adviceContainer.innerHTML = adviceHTML;
  }
  
  function generateMovementAdvice(answers) {
    let html = '<div class="guide-category"><h3>Beweging';
    
    // Add priority badge
    if (answers.activity === 'sedentary') {
      html += '<span class="priority-badge priority-high">Hoge Prioriteit</span>';
    } else if (answers.activity === 'light') {
      html += '<span class="priority-badge priority-medium">Belangrijke Prioriteit</span>';
    }
    
    html += '</h3><ul class="practice">';
    
    if (answers.workType === 'office' || answers.workType === 'remote') {
      html += '<li>Zet elk uur een timer: sta op en stretch 2 minuten</li>';
      html += '<li>Loop tijdens telefoongesprekken</li>';
      html += '<li>Gebruik de trap in plaats van de lift</li>';
      
      if (answers.time === 'minimal') {
        html += '<li>Doe 5-10 min ochtendgymnastiek direct na opstaan</li>';
        html += '<li>Park bewust verder weg voor extra stappen</li>';
      } else {
        html += '<li>Plan 30 min wandelen of fietsen per dag</li>';
        html += '<li>Overweeg sta-bureau of wissel zit-sta af</li>';
      }
    } else if (answers.workType === 'physical') {
      html += '<li>Warm-up routine van 5-10 min voor de werkdag</li>';
      html += '<li>Gebruik correcte hef- en buktechniek altijd</li>';
      html += '<li>Neem micro-pauzes: stretch armen/rug om de 2 uur</li>';
      html += '<li>Doe lichte yoga of stretching \'s avonds voor herstel</li>';
    } else if (answers.workType === 'student') {
      html += '<li>Gebruik gratis campus sportfaciliteiten</li>';
      html += '<li>Fiets of loop naar college</li>';
      html += '<li>YouTube workout videos (geen abonnement nodig)</li>';
      html += '<li>Loop trappen in plaats van lift</li>';
    }
    
    if (answers.activity === 'sedentary') {
      html += '<li><strong>Start met 10 min per dag en bouw op naar 30 min</strong></li>';
    }
    
    html += '</ul></div>';
    return html;
  }
  
  function generateNutritionAdvice(answers) {
    let html = '<div class="guide-category"><h3>Voeding';
    
    if (answers.nutrition === 'poor' || answers.nutrition === 'irregular') {
      html += '<span class="priority-badge priority-high">Hoge Prioriteit</span>';
    }
    
    html += '</h3><ul class="practice">';
    
    if (answers.nutrition === 'irregular') {
      html += '<li><strong>Eet op vaste tijden, ook als je niet hongerig bent</strong></li>';
      html += '<li>Stel alarmen voor maaltijdtijden</li>';
    }
    
    if (answers.workType === 'student' || answers.time === 'minimal') {
      html += '<li>Meal prep op zondag: kook in bulk, verdeel in porties</li>';
      html += '<li>Koop basis-ingrediënten: rijst, eieren, diepvries groenten</li>';
      html += '<li>Maak je eigen snacks: goedkoper en gezonder</li>';
    } else {
      html += '<li>Bereid je lunch de avond van tevoren voor</li>';
      html += '<li>Houd gezonde snacks bij de hand (noten, fruit)</li>';
    }
    
    if (answers.schedule === 'night') {
      html += '<li>Eet je hoofdmaaltijd vóór je nachtdienst begint</li>';
      html += '<li>Neem lichte, eiwitrijke snacks mee</li>';
      html += '<li>Vermijd zware maaltijden tijdens nachtdienst</li>';
      html += '<li>Beperk cafeïne na 03:00 uur</li>';
    } else {
      html += '<li>Drink 2L water per dag (zet fles bij je bureau)</li>';
      html += '<li>Eet groente bij elke maaltijd</li>';
      html += '<li>Vermijd te veel bewerkt voedsel en suiker</li>';
    }
    
    if (answers.workType === 'physical') {
      html += '<li>Eet binnen 2 uur na werk (eiwit + koolhydraten voor herstel)</li>';
      html += '<li>Drink 2-3L water tijdens fysiek werk</li>';
    }
    
    html += '</ul></div>';
    return html;
  }
  
  function generateSleepAdvice(answers) {
    let html = '<div class="guide-category"><h3>Slaap';
    
    if (answers.sleep === 'poor' || answers.sleep === 'insufficient') {
      html += '<span class="priority-badge priority-high">Hoge Prioriteit</span>';
    } else if (answers.sleep === 'inconsistent') {
      html += '<span class="priority-badge priority-medium">Belangrijke Prioriteit</span>';
    }
    
    html += '</h3><ul class="practice">';
    
    if (answers.schedule === 'night') {
      html += '<li><strong>Verduister je slaapkamer volledig (zwarte gordijnen, oogmasker)</strong></li>';
      html += '<li>Gebruik oordoppen of witte ruis</li>';
      html += '<li>Houd slaapkamer extra koel (15-17°C)</li>';
      html += '<li>Draag zonnebril op weg naar huis na nachtdienst</li>';
      html += '<li>Ga altijd rond dezelfde tijd slapen na je dienst</li>';
    } else {
      html += '<li>Ga elke dag rond dezelfde tijd naar bed (ook weekenden)</li>';
      html += '<li>Zet schermen 1 uur voor slapen uit</li>';
      html += '<li>Houd slaapkamer koel (16-18°C) en donker</li>';
      html += '<li>Maak een rustgevend avondritueel</li>';
    }
    
    if (answers.sleep === 'insufficient') {
      html += '<li><strong>Streef naar minimaal 7 uur - dit is niet-onderhandelbaar voor je gezondheid</strong></li>';
    }
    
    if (answers.workType === 'student' && answers.sleep === 'inconsistent') {
      html += '<li>Beperk all-nighters tot absolute noodgevallen</li>';
      html += '<li>Power nap van 20 min kan helpen (niet langer)</li>';
    }
    
    html += '<li>Vermijd cafeïne na 16:00 uur</li>';
    html += '</ul></div>';
    return html;
  }
  
  function generateMentalHealthAdvice(answers) {
    let html = '<div class="guide-category"><h3>Mentale Gezondheid';
    
    if (answers.challenge === 'stress') {
      html += '<span class="priority-badge priority-high">Hoge Prioriteit</span>';
    }
    
    html += '</h3><ul class="practice">';
    
    if (answers.challenge === 'stress') {
      html += '<li><strong>Start met 5 min ademhalingsoefeningen per dag</strong></li>';
      html += '<li>Download een mindfulness app (Headspace, Calm)</li>';
      html += '<li>Noteer 3 dingen waar je dankbaar voor bent elke avond</li>';
    }
    
    if (answers.workType === 'remote') {
      html += '<li>Plan regelmatige video-calls met collega\'s</li>';
      html += '<li>Werk af en toe op andere locatie (café, bibliotheek)</li>';
      html += '<li>Neem deel aan lokale activiteiten buiten werktijd</li>';
    }
    
    if (answers.workType === 'student') {
      html += '<li>Gebruik gratis studentenpsycholoog bij stress/angst</li>';
      html += '<li>Praat met medestudenten over struggles</li>';
      html += '<li>Beperk social media (vergelijking = stress)</li>';
    }
    
    html += '<li>Neem echte pauzes: wandel in plaats van scrollen</li>';
    html += '<li>Zet duidelijke grenzen tussen werk en privé</li>';
    
    if (answers.time !== 'minimal') {
      html += '<li>Overweeg één yoga of meditatie sessie per week</li>';
    }
    
    html += '</ul></div>';
    return html;
  }
  
  function generateChallengeAdvice(answers) {
    let html = '<div class="guide-category"><h3>';
    
    if (answers.challenge === 'energy') {
      html += 'Extra: Boost Je Energie';
    } else if (answers.challenge === 'motivation') {
      html += 'Extra: Verhoog Je Motivatie';
    } else if (answers.challenge === 'time') {
      html += 'Extra: Maximaliseer Je Tijd';
    } else if (answers.challenge === 'physical') {
      html += 'Extra: Verminder Fysieke Klachten';
    } else {
      return ''; // Already covered in mental health
    }
    
    html += '</h3><ul class="practice">';
    
    if (answers.challenge === 'energy') {
      html += '<li>Check of je voldoende ijzer en B12 binnenkrijgt</li>';
      html += '<li>Verbeter eerst je slaap - dat heeft grootste impact</li>';
      html += '<li>Eet complexe koolhydraten voor stabiele energie</li>';
      html += '<li>Wandel 10 min na lunch (voorkomt middagdip)</li>';
      html += '<li>Drink voldoende water (dehydratie = vermoeidheid)</li>';
    } else if (answers.challenge === 'motivation') {
      html += '<li>Maak het zichtbaar: leg sportkleren klaar</li>';
      html += '<li>Zoek een buddy: samen is makkelijker</li>';
      html += '<li>Start extreem klein: 2 squats is beter dan niks</li>';
      html += '<li>Beloon jezelf na elke week dat je volhoudt</li>';
      html += '<li>Track je vooruitgang visueel (streep door dag op kalender)</li>';
    } else if (answers.challenge === 'time') {
      html += '<li>Combineer gewoontes: tandenpoe tsen + squats</li>';
      html += '<li>Kies activiteiten die je toch doet (trap i.p.v. lift)</li>';
      html += '<li>Gebruik "dode" tijd: wandelen tijdens telefoongesprek</li>';
      html += '<li>Meal prep bespaart 30+ min per dag</li>';
      html += '<li>Accepteer dat 10 min ook waarde heeft</li>';
    } else if (answers.challenge === 'physical') {
      html += '<li>Warm bad of douche na werk voor stijve spieren</li>';
      html += '<li>Foam roller of tennis bal voor trigger points</li>';
      html += '<li>Lichte stretching dagelijks (niet intensief)</li>';
      html += '<li>Check ergonomie werkplek (kan veel verklaren)</li>';
      html += '<li>Overweeg fysiotherapeut als pijn aanhoudt</li>';
    }
    
    html += '</ul></div>';
    return html;
  }
  
  function generateTravelAdvice(answers) {
    let html = '<div class="guide-category"><h3>Extra: Gezond Blijven Onderweg</h3>';
    html += '<ul class="practice">';
    html += '<li>Download bodyweight workout apps (geen equipment nodig)</li>';
    html += '<li>Kies hotels met fitnessruimte of zwembad</li>';
    html += '<li>Koop basics in lokale supermarkt (yoghurt, fruit, noten)</li>';
    html += '<li>Neem reisvriendelijke snacks mee</li>';
    html += '<li>Neem je eigen kussen mee voor betere slaap</li>';
    html += '<li>Download witte ruis apps voor onbekende geluiden</li>';
    html += '<li>Blijf gehydrateerd tijdens vluchten</li>';
    html += '<li>Zoek daglicht op bij aankomst (helpt tegen jetlag)</li>';
    html += '</ul></div>';
    return html;
  }
}
