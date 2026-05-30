import { Effect, Schema, pipe } from 'effect';
import { parse, stringify } from 'yaml';
import { ResumeSchema, type Resume } from './ResumeSchema';

export class ResumeParseError extends Error {
  readonly _tag = 'ResumeParseError';

  constructor(message: string, readonly cause?: unknown) {
    super(message);
  }
}

export interface ParseSuccess {
  ok: true;
  value: Resume;
}

export interface ParseFailure {
  ok: false;
  error: string;
}

export type ParseResult = ParseSuccess | ParseFailure;

const decodeResume = Schema.decodeUnknown(ResumeSchema);

export function parseYamlToAst(yamlString: string): Effect.Effect<Resume, ResumeParseError> {
  return pipe(
    Effect.try({
      try: () => parse(yamlString),
      catch: (cause) => new ResumeParseError('YAML syntax error', cause)
    }),
    Effect.flatMap((value) =>
      pipe(
        decodeResume(value),
        Effect.map((decoded) => decoded as Resume),
        Effect.mapError((cause) => new ResumeParseError('Resume schema mismatch', cause))
      )
    )
  );
}

export function parseAstToYaml(resume: Resume): Effect.Effect<string, ResumeParseError> {
  return Effect.try({
    try: () =>
      stringify(resume, {
        indent: 2,
        lineWidth: 0,
        defaultStringType: 'QUOTE_DOUBLE'
      }),
    catch: (cause) => new ResumeParseError('Could not serialize resume YAML', cause)
  });
}

export function parseYamlToAstResult(yamlString: string): Promise<ParseResult> {
  return Effect.runPromise(
    pipe(
      parseYamlToAst(yamlString),
      Effect.match({
        onFailure: (error): ParseFailure => ({
          ok: false,
          error: formatParseError(error)
        }),
        onSuccess: (value): ParseSuccess => ({
          ok: true,
          value
        })
      })
    )
  );
}

export function parseAstToYamlResult(resume: Resume): Promise<ParseFailure | { ok: true; value: string }> {
  return Effect.runPromise(
    pipe(
      parseAstToYaml(resume),
      Effect.match({
        onFailure: (error): ParseFailure => ({
          ok: false,
          error: formatParseError(error)
        }),
        onSuccess: (value) => ({
          ok: true as const,
          value
        })
      })
    )
  );
}

function formatParseError(error: ResumeParseError): string {
  if (error.cause instanceof Error && error.cause.message) {
    return `${error.message}: ${error.cause.message}`;
  }

  if (typeof error.cause === 'object' && error.cause !== null && 'message' in error.cause) {
    return `${error.message}: ${String(error.cause.message)}`;
  }

  return error.message;
}
