export type TestCase = {
  input: string;
  output: string;
  _id: string;
};

export type CodeStub = {
  language: string;
  startSnippet: string;
  endSnippet: string;
  _id: string;
};

export type ProblemData = {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  testCases: TestCase[];
  codeStubs: CodeStub[];
  url: string; // optional helper for frontend routing
};
