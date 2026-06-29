async function testWandboxC() {
  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'gcc-13.2.0-c',
      code: '#include <bits/stdc++.h>\nusing namespace std;\nint main() { printf("Hello\\n"); return 0; }',
      stdin: '',
      'compiler-option-raw': '-w',
      'runtime-option-raw': '',
      save: false,
    }),
  });
  const data = await response.json();
  console.log(data);
}

testWandboxC();
