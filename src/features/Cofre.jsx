import React, { useState } from 'react';
import { Lock, ChevronDown, BookText } from 'lucide-react';
import './Cofre.css';

const Cofre = () => {
  const [texto, setTexto] = useState('');

  const notasAntigas = [
    {
      id: 1,
      date: 'Quarta-Feira, 02 De Abril',
      content: 'Hoje foi um dia difícil. Mas consegui respirar e lembrar do que conversamos na sessão. Estou tentando.',
    },
    {
      id: 2,
      date: 'Terça-Feira, 01 De Abril',
      content: 'Ganhei na loteria. Fiquei muito rico.',
    }
  ];

  return (
    <div className="app-layout">
      <div className="app-container">
        
        {/* Cabeçalho */}
        <header className="header">
          <div className="header-icon">
            <Lock size={25} color="gold" />
          </div>
          <div className="header-title-container">
            <h1 className="header-title">
              <BookText size={20} color="#1f2937" className="title-icon" />
              O Cofre
            </h1>
          </div>
          <div className="header-status">
            <span>3 notas</span>
          </div>
        </header>

        <div className="container_privacy-banner">
          <Lock size={16} color="gold" className="icon-shrink" />
          <p className="container_privacy-text">
            Somente você lê isso. Nem seu terapeuta tem acesso.
          </p>
        </div>

        {/* Card Principal - Nova Nota */}
        <div className="card_diario">
          <div className="card_diario-datas">
            <span className="card_diario-hoje">Hoje</span>
            <span className="card_diario-text">Quinta-Feira, 02 De Abril</span>
          </div>
          
          <textarea
            className="Card_diario-textarea"
            placeholder="Como você está se sentindo hoje? Este espaço é só seu..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            
          />
          
          <div className="Card_diario-footer">
            <span className="Card_diario-counter">
              {texto.length} caracteres
            </span>
            <button className="Card_diario-btn">
              Guardar no Cofre
            </button>
          </div>
        </div>

      
        <div className="Card_anotacao">
          <div className="Card_anotacao-wrapper">
            <div className="Card_anotacao-border"></div>
            <h2 className="Card_anotacao-titulo">Anotações Anteriores</h2>
          </div>

          <div className="Card_anotacao-notas">
            {notasAntigas.map((note) => (
              <div key={note.id} className="Card_anotacao-nota">
                <div className="Card_anotacao-nota-wrapper">
                  <h3 className="Card_anotacao-nota-titulo">{note.date}</h3>
                  <ChevronDown size={18} color="#4b5563" />
                </div>
                <p className="Card_anotacao-nota-text">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cofre;