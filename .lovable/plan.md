## Changes to `src/components/aic-isb/task-five.tsx`

1. **Remove the entire "Your resume line" section** (lines ~1309–1339) — heading, paragraph, code block, and Copy button.
2. **Remove "Mentor Mapping" and "Founder Empathy"** from the `SKILL_BADGES` array (lines ~912–922). Leave them in the earlier preview list (lines ~842–849) untouched unless you want them removed there too — let me know.
3. **Remove the "Finish internship" button** (lines ~1388–1393) from the footer section.
4. Remove now-unused code tied to the resume line: `resumeLine` useMemo, `resumeCopied` state, `copyResume` function, `buildResumeLineAic` helper, and the `Copy`/`Check` imports if they become unused after the skill copy block is reviewed (skills section still uses Copy/Check, so keep them).
5. Update the small subtitle under the CTA on the results screen (line 867) from `"Certificate · Skills · Resume line"` to `"Certificate · Skills"`.

Also confirm: should "Mentor Mapping" / "Founder Empathy" also be removed from the **"Skill badges earned"** preview on the prior results screen (lines 842–849)?