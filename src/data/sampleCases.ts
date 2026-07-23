import { SampleCase } from '../types';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'algebra-sign-error',
    title: 'Algebra: Distributive Sign Error',
    topic: 'Algebra',
    educationLevel: 'School',
    difficulty: 'Beginner',
    description: 'A common mistake when distributing a negative sign across parenthesis.',
    problem: 'Solve for x:  3(x - 4) - 2(2x - 5) = 11',
    solution: `Step 1: 3x - 12 - 4x - 10 = 11
Step 2: -x - 22 = 11
Step 3: -x = 33
Step 4: x = -33`
  },
  {
    id: 'calculus-chain-rule',
    title: 'Calculus: Missing Chain Rule Term',
    topic: 'Calculus',
    educationLevel: 'College',
    difficulty: 'Intermediate',
    description: 'Forgetting to multiply by the derivative of the inner function.',
    problem: 'Find the derivative with respect to x of:  f(x) = sin(3x^2 + 5)',
    solution: `Step 1: f'(x) = cos(3x^2 + 5)
Step 2: Therefore, f'(x) = cos(3x^2 + 5)`
  },
  {
    id: 'quadratic-equation-factoring',
    title: 'Equations: Quadratic Sign Flip',
    topic: 'Equations',
    educationLevel: 'School',
    difficulty: 'Beginner',
    description: 'Failing to invert signs when setting factored terms equal to zero.',
    problem: 'Solve for x:  x^2 - 5x + 6 = 0',
    solution: `Step 1: Factor the expression into (x - 2)(x - 3) = 0
Step 2: Set factors equal to zero: x - 2 = 0 or x - 3 = 0
Step 3: Solve for x: x = -2 or x = -3`
  },
  {
    id: 'trig-identity-error',
    title: 'Trigonometry: Square Root Identity Pitfall',
    topic: 'Trigonometry',
    educationLevel: 'College',
    difficulty: 'Intermediate',
    description: 'Incorrectly applying square root across additions in trig identities.',
    problem: 'Simplify:  \\sqrt{1 - \\cos^2(x)} + \\sqrt{1 + \\tan^2(x)}  for x in the first quadrant.',
    solution: `Step 1: \\sqrt{1 - \\cos^2(x)} = 1 - \\cos(x)
Step 2: \\sqrt{1 + \\tan^2(x)} = \\sqrt{\\sec^2(x)} = \\sec(x)
Step 3: Expression = 1 - \\cos(x) + \\sec(x)`
  },
  {
    id: 'linear-algebra-matrix',
    title: 'Linear Algebra: Non-Commutativity Error',
    topic: 'Linear Algebra',
    educationLevel: 'Undergraduate',
    difficulty: 'Advanced',
    description: 'Assuming matrix multiplication is commutative when expanding (A + B)^2.',
    problem: 'Simplify the matrix expression:  (A + B)^2  where A and B are square matrices.',
    solution: `Step 1: (A + B)^2 = (A + B)(A + B)
Step 2: = A^2 + AB + BA + B^2
Step 3: Since AB + BA = 2AB, (A + B)^2 = A^2 + 2AB + B^2`
  }
];
