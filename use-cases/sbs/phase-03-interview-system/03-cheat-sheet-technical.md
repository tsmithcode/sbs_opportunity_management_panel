# Interview Cheat Sheet — Technical / Coding / Design Discussion

## Topics Most Likely To Surface
- C# and .NET fundamentals
- desktop app architecture
- Autodesk API patterns
- debugging hard issues
- performance bottlenecks
- data integrity
- state management in design tools
- code maintainability and testing

## Sound Technical in This Direction
### Architecture
- separation of concerns
- command/services/view models
- adapter layers around external APIs
- validation boundaries
- deterministic error handling
- logging and diagnosability

### Performance
- minimize unnecessary model traversals
- cache carefully
- batch expensive operations
- avoid UI thread abuse
- profile before over-optimizing
- protect correctness first, then optimize hot paths

### Data Integrity
- validate inputs early
- preserve model consistency
- enforce invariants
- make failure states observable
- use idempotent operations where retry is possible

## Technical Answer Framing
When asked how you would build or debug something:
1. clarify the workflow and invariants
2. isolate system boundaries
3. identify failure points
4. propose observability
5. discuss implementation and tests

## Revit / Geometry Gap Mitigation
If geometry-heavy questions arise:
- talk in terms of model integrity, constraints, transaction safety, object relationships, performance hot paths, and user workflow correctness
- do not pretend detailed Revit API knowledge you do not have
