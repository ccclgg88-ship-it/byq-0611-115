import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Question, WrongAnswerRecord, GameStatus, LifelineType } from '../types';
import { calculateScore, getMaxCombo } from '../utils/score';
import { pickRandomQuestions } from '../utils/shuffle';
import { applyFiftyFifty } from '../utils/lifelines';
import { generateSessionId, setHighScore, setMaxComboRecord, getMaxComboRecord, getHighScore } from '../utils/session';
import { submitWrongAnswer, fetchQuizBank, flattenQuizBank } from '../api/quiz';
const QUESTIONS_PER_LEVEL = 5;
const TIME_PER_QUESTION = 15;
const INITIAL_LIVES = 3;
export const useQuizStore = defineStore('quiz', () => {
 const status = ref<GameStatus>('idle');
 const questions = ref<Question[]>([]);
 const currentIndex = ref(0);
 const score = ref(0);
 const combo = ref(0);
 const maxCombo = ref(0);
 const lives = ref(INITIAL_LIVES);
 const timeLeft = ref(TIME_PER_QUESTION);
 const lifelines = ref<Record<LifelineType, boolean>>({
 fiftyFifty: true,
 hint: true
 });
 const hiddenOptions = ref<number[]>([]);
 const hintVisible = ref(false);
 const wrongAnswers = ref<WrongAnswerRecord[]>([]);
 const reportedQuestionIds = ref<Set<string>>(new Set());
 const sessionId = ref('');
 const answered = ref(false);
 const lastAnswerCorrect = ref<boolean | null>(null);
 const selectedAnswer = ref<number | null>(null);
 const bankLoaded = ref(false);
 const allQuestions = ref<Question[]>([]);
 let timerInterval: number | null = null;
 let hintTimeout: number | null = null;
 const currentQuestion = computed(() => questions.value[currentIndex.value] || null);
 const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1);
 const progress = computed(() => questions.value.length > 0
 ? ((currentIndex.value + 1) / questions.value.length) * 100
 : 0);
 const canStart = computed(() => allQuestions.value.length >= QUESTIONS_PER_LEVEL);
 const gameOver = computed(() => lives.value <= 0 || status.value === 'finished');
 function startTimer() {
 stopTimer();
 timerInterval = window.setInterval(() => {
 if (status.value === 'playing') {
 timeLeft.value -= 1;
 if (timeLeft.value <= 0) {
 handleTimeout();
 }
 }
 }, 1000);
 }
 function stopTimer() {
 if (timerInterval) {
 clearInterval(timerInterval);
 timerInterval = null;
 }
 }
 function handleTimeout() {
 if (answered.value)
 return;
 handleAnswer(-1);
 }
 function handleAnswer(answerIndex: number) {
 if (answered.value || status.value !== 'playing')
 return;
 answered.value = true;
 selectedAnswer.value = answerIndex;
 stopTimer();
 const question = currentQuestion.value;
 if (!question)
 return;
 const isCorrect = answerIndex === question.correctAnswer;
 lastAnswerCorrect.value = isCorrect;
 const result = calculateScore(combo.value, isCorrect);
 if (isCorrect) {
 score.value += result.score;
 combo.value = result.newCombo;
 maxCombo.value = getMaxCombo(maxCombo.value, combo.value);
 }
 else {
 combo.value = 0;
 lives.value -= 1;
 const record: WrongAnswerRecord = {
 questionId: question.id,
 question: question.question,
 userAnswer: answerIndex,
 correctAnswer: question.correctAnswer,
 options: question.options,
 explanation: question.explanation
 };
 wrongAnswers.value.push(record);
 reportWrongAnswer(record);
 }
 setTimeout(() => {
 if (lives.value <= 0) {
 finishGame();
 }
 else if (isLastQuestion.value) {
 finishGame();
 }
 else {
 nextQuestion();
 }
 }, 1500);
 }
 async function reportWrongAnswer(record: WrongAnswerRecord) {
 if (reportedQuestionIds.value.has(record.questionId)) {
 return;
 }
 reportedQuestionIds.value.add(record.questionId);
 try {
 await submitWrongAnswer(sessionId.value, record);
 }
 catch (e) {
 console.error('Failed to report wrong answer:', e);
 }
 }
 function nextQuestion() {
 currentIndex.value += 1;
 timeLeft.value = TIME_PER_QUESTION;
 answered.value = false;
  lastAnswerCorrect.value = null;
  selectedAnswer.value = null;
  hiddenOptions.value = [];
 hintVisible.value = false;
 if (hintTimeout) {
 clearTimeout(hintTimeout);
 hintTimeout = null;
 }
 startTimer();
 }
 function finishGame() {
 stopTimer();
 status.value = 'finished';
 setHighScore(score.value);
 setMaxComboRecord(maxCombo.value);
 }
 function useFiftyFifty() {
 if (!lifelines.value.fiftyFifty || answered.value || status.value !== 'playing') {
 return;
 }
 const question = currentQuestion.value;
 if (!question)
 return;
 hiddenOptions.value = applyFiftyFifty(question);
 lifelines.value.fiftyFifty = false;
 }
 function useHint() {
 if (!lifelines.value.hint || answered.value || status.value !== 'playing') {
 return;
 }
 lifelines.value.hint = false;
 hintVisible.value = true;
 hintTimeout = window.setTimeout(() => {
 hintVisible.value = false;
 }, 5000);
 }
 function togglePause() {
 if (status.value === 'playing') {
 status.value = 'paused';
 stopTimer();
 }
 else if (status.value === 'paused') {
 status.value = 'playing';
 startTimer();
 }
 }
 async function loadBank() {
 if (bankLoaded.value)
 return;
 try {
 const bank = await fetchQuizBank();
 allQuestions.value = flattenQuizBank(bank);
 bankLoaded.value = true;
 }
 catch (e) {
 console.error('Failed to load quiz bank:', e);
 }
 }
 function startGame() {
 if (allQuestions.value.length < QUESTIONS_PER_LEVEL) {
 throw new Error('题库不足5题，无法开始游戏');
 }
 questions.value = pickRandomQuestions(allQuestions.value, QUESTIONS_PER_LEVEL);
 currentIndex.value = 0;
 score.value = 0;
 combo.value = 0;
 maxCombo.value = 0;
 lives.value = INITIAL_LIVES;
 timeLeft.value = TIME_PER_QUESTION;
 lifelines.value = { fiftyFifty: true, hint: true };
 hiddenOptions.value = [];
 hintVisible.value = false;
 wrongAnswers.value = [];
 reportedQuestionIds.value = new Set();
 sessionId.value = generateSessionId();
 answered.value = false;
 lastAnswerCorrect.value = null;
 selectedAnswer.value = null;
 status.value = 'playing';
 startTimer();
 }
 function resetGame() {
 stopTimer();
 if (hintTimeout) {
 clearTimeout(hintTimeout);
 hintTimeout = null;
 }
 status.value = 'idle';
 questions.value = [];
 currentIndex.value = 0;
 score.value = 0;
 combo.value = 0;
 lives.value = INITIAL_LIVES;
 timeLeft.value = TIME_PER_QUESTION;
 lifelines.value = { fiftyFifty: true, hint: true };
 hiddenOptions.value = [];
 hintVisible.value = false;
 wrongAnswers.value = [];
 answered.value = false;
  lastAnswerCorrect.value = null;
  selectedAnswer.value = null;
 }
 function cleanup() {
 stopTimer();
 if (hintTimeout) {
 clearTimeout(hintTimeout);
 hintTimeout = null;
 }
 }
 return {
 status,
 questions,
 currentIndex,
 score,
 combo,
 maxCombo,
 lives,
 timeLeft,
 lifelines,
 hiddenOptions,
 hintVisible,
 wrongAnswers,
 sessionId,
 answered,
  lastAnswerCorrect,
  selectedAnswer,
 allQuestions,
 currentQuestion,
 isLastQuestion,
 progress,
 canStart,
 gameOver,
 bankLoaded,
 loadBank,
 startGame,
 handleAnswer,
 useFiftyFifty,
 useHint,
 togglePause,
 resetGame,
 cleanup,
 getHighScore,
 getMaxComboRecord
 };
});

