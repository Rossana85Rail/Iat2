const timeline = [];

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

const id_code = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Inserisci le <strong>prime tre lettere del tuo nome</strong> e le <strong>prime tre lettere del tuo cognome</strong> per creare un codice identificativo anonimo.</p>
    <p>Digita il codice e premi INVIO.</p>
    <input type='text' id='id_input' autofocus>
    <script>
      document.querySelector('input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') jsPsych.finishTrial({ codice: this.value });
      });
    </script>
  `,
  choices: "NO_KEYS",
  on_finish: data => {
    jsPsych.data.addProperties({ codice_identificativo: data.codice });
  }
};
timeline.push(id_code);

// Immagini (caricate nella root)
const immagini_positive = [
  "<img src='etero1.PNG' width='200'>",
  "<img src='etero2.PNG' width='200'>"
];

const immagini_negative = [
  "<img src='gay1.PNG' width='200'>",
  "<img src='gay2.PNG' width='200'>"
];

// Parole
const parole_positive = ["Amore", "Tenerezza", "Gentilezza", "Sicurezza"];
const parole_negative = ["Disgusto", "Paura", "Rifiuto", "Vergogna"];

// Funzione per creare un trial
function creaTrial(stimolo, categoria_corretta) {
  return {
    type: stimolo.includes("img") ? jsPsychImageKeyboardResponse : jsPsychHtmlKeyboardResponse,
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

// Istruzioni
const istruzioni = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Premi il tasto <strong>F</strong> se l'immagine o la parola appartiene alla categoria a sinistra.</p>
    <p>Premi il tasto <strong>J</strong> se appartiene alla categoria a destra.</p>
    <p>Prova a rispondere il più velocemente possibile, ma senza errori.</p>
    <p>Premi SPAZIO per iniziare.</p>
  `,
  choices: [" "]
};
timeline.push(istruzioni);

// Genera trials
const trials = [];
parole_positive.forEach(p => trials.push(creaTrial(p, 'sinistra')));
parole_negative.forEach(p => trials.push(creaTrial(p, 'destra')));
immagini_positive.forEach(img => trials.push(creaTrial(img, 'sinistra')));
immagini_negative.forEach(img => trials.push(creaTrial(img, 'destra')));
timeline.push(...jsPsych.randomization.shuffle(trials));

// Avvia lo IAT
jsPsych.run(timeline);
