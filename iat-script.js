const timeline = [];

// Benvenuto
const welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p><strong>Benvenuto/a!</strong></p>
    <p>In questo test ti verrà chiesto di classificare parole e immagini.</p>
    <p>Premi la barra spaziatrice per continuare.</p>
  `,
  choices: [" "]
};
timeline.push(welcome);

// Codice identificativo
const codice_id = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Inserisci le <strong>prime tre lettere del tuo nome</strong> e le <strong>prime tre lettere del tuo cognome</strong>.</p>
    <input id="codice" type="text" maxlength="6" autofocus>
    <script>
      document.querySelector('#codice').addEventListener('keydown', function(e) {
        if(e.key === 'Enter') jsPsych.finishTrial({ codice: this.value });
      });
    </script>
  `,
  choices: "NO_KEYS",
  on_finish: data => {
    jsPsych.data.addProperties({ codice_identificativo: data.codice });
  }
};
timeline.push(codice_id);

// Istruzioni
const istruzioni = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Premi <strong>F</strong> se la parola o immagine è della categoria a sinistra.</p>
    <p>Premi <strong>J</strong> se è della categoria a destra.</p>
    <p>Rispondi il più velocemente possibile, ma cerca di non sbagliare.</p>
    <p>Premi la barra spaziatrice per iniziare.</p>
  `,
  choices: [" "]
};
timeline.push(istruzioni);

// Stimoli
const parole_positive = ["Amore", "Felicità", "Pace", "Tenerezza"];
const parole_negative = ["Paura", "Rabbia", "Odio", "Disgusto"];

const immagini_positive = [
  "<img src='etero1.PNG' width='200'>",
  "<img src='etero2.PNG' width='200'>"
];

const immagini_negative = [
  "<img src='gay1.PNG' width='200'>",
  "<img src='gay2.PNG' width='200'>"
];

// Funzione per creare un trial
function creaTrial(stimolo, categoria_corretta) {
  return {
    type: stimolo.includes("<img") ? jsPsychHtmlKeyboardResponse : jsPsychHtmlKeyboardResponse,
    stimulus: stimolo,
    choices: ['f', 'j'],
    data: {
      stimolo: stimolo,
      corretto: categoria_corretta
    },
    on_finish: function(data) {
      const risposta = data.response;
      data.correct = (
        (risposta === 'f' && categoria_corretta === 'sinistra') ||
        (risposta === 'j' && categoria_corretta === 'destra')
      );
    }
  };
}

// Crea i trials e randomizza
let trials = [];
parole_positive.forEach(p => trials.push(creaTrial(p, 'sinistra')));
parole_negative.forEach(p => trials.push(creaTrial(p, 'destra')));
immagini_positive.forEach(p => trials.push(creaTrial(p, 'sinistra')));
immagini_negative.forEach(p => trials.push(creaTrial(p, 'destra')));
trials = jsPsych.randomization.shuffle(trials);

timeline.push(...trials);

// Avvio
jsPsych.run(timeline);
