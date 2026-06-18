import { describe, it, expect, afterEach } from 'vitest';

import {
  personalityMatrix,
  getPersonalitySummary,
  resolvePersonalityProject,
} from '@/lib/personalityMatrix';

describe('personalityMatrix', () => {
  it('includes all frameworks and entry metadata', () => {
    expect(personalityMatrix.enneagram).toBeDefined();
    expect(personalityMatrix.attachment).toBeDefined();
    expect(personalityMatrix.mbti).toBeDefined();

    Object.values(personalityMatrix.enneagram).forEach((entry) => {
      expect(entry.name).toBeTruthy();
      expect(entry.coreSentence).toBeTruthy();
      expect(entry.funFact).toBeTruthy();
      expect(entry.growthTip).toBeTruthy();
      expect(entry.poeticImagery).toBeTruthy();
      expect(entry.compatibility).toBeDefined();
      expect(Array.isArray(entry.compatibility.best)).toBe(true);
      expect(Array.isArray(entry.compatibility.challenging)).toBe(true);
    });

    Object.values(personalityMatrix.attachment).forEach((entry) => {
      expect(entry.name).toBeTruthy();
      expect(entry.coreSentence).toBeTruthy();
      expect(entry.funFact).toBeTruthy();
      expect(entry.growthTip).toBeTruthy();
      expect(entry.poeticImagery).toBeTruthy();
      expect(entry.compatibility).toBeDefined();
      expect(Array.isArray(entry.compatibility.best)).toBe(true);
      expect(Array.isArray(entry.compatibility.challenging)).toBe(true);
    });

    Object.values(personalityMatrix.mbti).forEach((entry) => {
      expect(entry.name).toBeTruthy();
      expect(entry.coreSentence).toBeTruthy();
      expect(entry.funFact).toBeTruthy();
      expect(entry.growthTip).toBeTruthy();
      expect(entry.poeticImagery).toBeTruthy();
      expect(entry.compatibility).toBeDefined();
      expect(Array.isArray(entry.compatibility.best)).toBe(true);
      expect(Array.isArray(entry.compatibility.challenging)).toBe(true);
    });
  });

  it('summarizes type counts across frameworks', () => {
    const summary = getPersonalitySummary();

    expect(summary).toMatchObject({
      enneagramTypes: 9,
      attachmentStyles: 4,
    });
    expect(summary.mbtiTypes).toBe(Object.keys(personalityMatrix.mbti).length);
    expect(summary.totalEntries).toBe(
      summary.enneagramTypes + summary.attachmentStyles + summary.mbtiTypes
    );
  });
});

describe('resolvePersonalityProject', () => {
  const originalDefaultProject = process.env.DEFAULT_PROJECT;

  afterEach(() => {
    if (typeof originalDefaultProject === 'undefined') {
      delete process.env.DEFAULT_PROJECT;
    } else {
      process.env.DEFAULT_PROJECT = originalDefaultProject;
    }
  });

  it('defaults to MediBurgh when no input is provided', () => {
    delete process.env.DEFAULT_PROJECT;

    const project = resolvePersonalityProject();

    expect(project).toMatchObject({
      key: 'mediburgh',
      name: 'MediBurgh',
      repo: 'mediburgh',
      isFallback: false,
    });
    expect(project.instructions).toMatch(/MediBurgh repo/i);
  });

  it('respects DEFAULT_PROJECT environment configuration for Manix', () => {
    process.env.DEFAULT_PROJECT = 'Manix';

    const project = resolvePersonalityProject();

    expect(project).toMatchObject({
      key: 'manix',
      name: 'Manix',
      repo: 'manix',
      isFallback: false,
    });
    expect(project.instructions).toMatch(/Manix repo/i);
  });

  it('accepts an explicit Manix query regardless of env defaults', () => {
    process.env.DEFAULT_PROJECT = 'MediBurgh';

    const project = resolvePersonalityProject('manix');

    expect(project.isFallback).toBe(false);
    expect(project.name).toBe('Manix');
    expect(project.key).toBe('manix');
  });

  it('falls back gracefully when an unknown project is requested', () => {
    delete process.env.DEFAULT_PROJECT;

    const project = resolvePersonalityProject('Unknown');

    expect(project).toMatchObject({
      key: 'mediburgh',
      name: 'MediBurgh',
      repo: 'mediburgh',
      isFallback: true,
      requested: 'Unknown',
    });
  });
});
