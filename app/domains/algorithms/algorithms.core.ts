import dayjs from 'dayjs';
import {
  AlgorithmId,
  SpacedRepetitionAlgorithm,
  HalfLifeRegressionScore,
  LeitnerScore,
  SuperMemo2Score,
  SuperMemo18Score,
} from './algorithms.types';

/**
 * @name Leitner System
 * @description A simple spaced repetition system using boxes to manage study frequency.
 * Correct answers move a card to the next box (studied less frequently),
 * while incorrect answers move it back to the first box (studied more frequently).
 */
const leitnerSystem: SpacedRepetitionAlgorithm<LeitnerScore> = {
  id: 'leitner',
  name: 'Leitner System',
  description: 'Simple box-based system for managing study frequency',
  answerOptions: [
    { text: 'Forgot', score: 0 },
    { text: 'Remembered', score: 1 },
  ],
  study: (prevStudyState, score) => {
    // Defaults
    const box = prevStudyState.box || 1;

    // Core logic
    const newBox = score === 1 ? Math.min(box + 1, 5) : 1;
    const daysUntilStudy = [1, 2, 5, 8, 14, 30][newBox - 1];

    return {
      ...prevStudyState,
      nextStudiedAt: dayjs().add(daysUntilStudy, 'day').toDate(),
      lastStudiedAt: new Date(),
      box: newBox,
    };
  },
};

/**
 * @name SuperMemo-2 (SM-2)
 * @description A popular spaced repetition algorithm that calculates optimal intervals
 * based on the quality of recall. It uses an "ease factor" that's adjusted based on
 * how easily the user recalls the information.
 */
const superMemo2: SpacedRepetitionAlgorithm<SuperMemo2Score> = {
  id: 'sm2',
  name: 'SuperMemo-2',
  description: 'Calculates optimal intervals based on recall quality',
  answerOptions: [
    { text: 'Forgot', score: 0 },
    { text: 'Struggled', score: 1 },
    { text: 'Easy', score: 2 },
  ],
  study: (prevStudyState, score) => {
    // Defaults
    let interval = prevStudyState.interval ?? 0;
    let repetitions = prevStudyState.repetitions ?? 0;
    let easeFactor = prevStudyState.easeFactor ?? 2.5;

    // Next interval
    let nextInterval: number;

    if (score >= 1) {
      if (repetitions === 0) {
        nextInterval = 1;
      } else if (repetitions === 1) {
        nextInterval = score === 2 ? 5 : 2;
      } else {
        nextInterval = Math.round((interval * easeFactor * score) / 2);
      }
    } else {
      nextInterval = 1;
    }

    // Update study state
    if (score >= 1) {
      repetitions++;

      if (score === 1) {
        easeFactor = Math.max(1.3, easeFactor - 0.15);
      } else {
        easeFactor += 0.15;
      }
    } else {
      repetitions = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    return {
      ...prevStudyState,
      nextStudiedAt: dayjs().add(nextInterval, 'day').toDate(),
      lastStudiedAt: new Date(),
      interval: nextInterval,
      repetitions,
      easeFactor,
    };
  },
};

/**
 * @name Half-Life Regression (HLR)
 * @description An algorithm that models memory decay as a half-life and uses
 * machine learning to predict this decay. It adjusts difficulty and stability
 * parameters based on study score.
 */
const halfLifeRegression: SpacedRepetitionAlgorithm<HalfLifeRegressionScore> = {
  id: 'hlr',
  name: 'Half-Life Regression',
  description:
    'Models memory decay as a half-life using machine learning predictions',
  answerOptions: [
    { text: 'Incorrect', score: 0 },
    { text: 'Correct', score: 1 },
  ],
  study: (prevStudyState, score) => {
    // Defaults
    let lastStudyDate = prevStudyState.lastStudiedAt ?? new Date();
    let difficulty = prevStudyState.difficulty ?? 0.5;
    let stability = prevStudyState.stability ?? 1;

    // Core logic
    const elapsed = dayjs().diff(dayjs(lastStudyDate), 'day');
    const retrievability = Math.exp(-elapsed / stability);

    const newDifficulty = Math.max(
      0,
      Math.min(1, difficulty + (score === 1 ? -0.1 : 0.1)),
    );
    const newStability =
      score === 1 ? stability * (1 + 0.5 * retrievability) : stability * 0.5;

    const nextInterval =
      (newStability * Math.log(0.9)) / Math.log(retrievability);

    return {
      ...prevStudyState,
      nextStudiedAt: dayjs().add(nextInterval, 'day').toDate(),
      lastStudiedAt: new Date(),
      difficulty: newDifficulty,
      stability: newStability,
    };
  },
};

/**
 * @name SuperMemo-18 (SM-18)
 * @description An advanced spaced repetition algorithm that incorporates complex memory models.
 * It uses concepts like stability increase factor, retrievability, and difficulty
 * to optimize study intervals.
 */
const superMemo18: SpacedRepetitionAlgorithm<SuperMemo18Score> = {
  id: 'sm18',
  name: 'SuperMemo-18',
  description: 'Advanced algorithm incorporating complex memory models',
  answerOptions: [
    { text: 'Complete Blackout', score: 0 },
    { text: 'Incorrect', score: 1 },
    { text: 'Incorrect, But Remembered', score: 2 },
    { text: 'Correct, But Difficult', score: 3 },
    { text: 'Correct', score: 4 },
    { text: 'Perfect Recall', score: 5 },
  ],
  study: (prevStudyState, score) => {
    // Defaults
    let interval = prevStudyState.interval ?? 1;
    let stability = prevStudyState.stability ?? 1;
    let difficulty = prevStudyState.difficulty ?? 0.5;

    // Core logic
    const theta = 0.2; // Stability increase constant
    const normalizedGrade = score / 5;

    // Calculate retrievability based on the time since last study and current stability
    const retrievability = Math.exp(-interval / stability);

    let newStability;
    let newDifficulty;

    if (score >= 3) {
      // Correct recall
      const stabilityIncreaseFactor = 1 + theta * (1 - retrievability);
      newStability = stability * stabilityIncreaseFactor;
      // Decrease difficulty slightly for successful recall
      newDifficulty = difficulty - 0.05 * (1 - normalizedGrade);
    } else {
      // Incorrect recall
      newStability = stability * 0.5; // Halve the stability on failure
      newDifficulty = difficulty + 0.1 * (1 - normalizedGrade);
    }

    // Ensure difficulty stays within reasonable bounds (0.3 to 0.9)
    newDifficulty = Math.min(0.9, Math.max(0.3, newDifficulty));

    const newInterval = newStability;

    return {
      ...prevStudyState,
      nextStudiedAt: dayjs().add(newInterval, 'day').toDate(),
      lastStudiedAt: new Date(),
      interval: newInterval,
      stability: newStability,
      difficulty: newDifficulty,
    };
  },
};

export const algorithms = {
  leitner: leitnerSystem,
  sm2: superMemo2,
  hlr: halfLifeRegression,
  sm18: superMemo18,
};

export const getAlgorithm = (algorithmId: AlgorithmId) =>
  algorithms[algorithmId];
