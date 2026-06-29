#include <bits/stdc++.h>
using namespace std;

int main() {
    // Optimize standard I/O operations for competitive programming
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n; 
    if (!(cin >> n)) return 0;
    
    vector<int> v(n);
    for(int i = 0; i < n; i++){
        cin >> v[i];
    }
    
    // Print each number followed by a space
    for(int i = 0; i < n; i++){
        cout << v[i] << " ";
    }
    // Flush the buffer and move to a new line safely
    cout << "\n";
    
    cout << "Welcome to the Playground!\n";
    
    return 0;
}
