async function testWandbox() {
  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'gcc-13.2.0',
      code: '#include <bits/stdc++.h>\nusing namespace std;\nint main() { cout << "Hello" << endl; return 0; }',
      stdin: '',
      'compiler-option-raw': '-w',
      'runtime-option-raw': '',
      save: false,
    }),
  });
  const data = await response.json();
  console.log(data);
}

testWandbox();
