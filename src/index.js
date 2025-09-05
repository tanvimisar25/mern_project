import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Books from './Books';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <>
      <table border={2}> 
        <tr>
            <td> Book Name </td>
            <td> Author Name </td>
            <td> Price </td>
        </tr> 
            <Books name="Harry Potter and the Philosopher’s Stone" author="JK Rowling" price="700"/>
            <Books name="Harry Potter and the Chamber of Secrets" author="JK Rowling" price="750"/>
            <Books name="Harry Potter and the Prisoner of Azkaban" author="JK Rowling" price="800"/>
            <Books name="Harry Potter and the Goblet of Fire" author="JK Rowling" price="600"/>
            <Books name="Harry Potter and the Order of the Phoenix" author="JK Rowling" price="850"/>
            <Books name="HPLS OMG" author="JK Rowling" price="850"/>
</table>

  </>
);
