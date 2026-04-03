import React, { useState } from 'react';
import { Lock, ChevronDown, BookText } from 'lucide-react';
import './Cofre.css';
import { PageHeader } from '../../shared/molecules/PageHeader/PageHeader';
import { Button } from '../../shared/atoms/Button';

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
    <div className="cofre">
      <div className="cofre__container">

        <PageHeader title="O Cofre" iconTitle={BookText} icon={Lock} comment={`${notasAntigas.length} notas salvas`} />

        <div className="cofre__privacy-banner">
          <Lock size={16} color="gold" className="icon-shrink" />
          <p className="cofre__privacy-text">
            Somente você lê isso. Nem seu terapeuta tem acesso.
          </p>
        </div>

        {/* Card Principal - Nova Nota */}
        <div className="cofre__note-card">
          <div className="cofre__note-card__date-row">
            <span className="cofre__note-card__today-tag">Hoje</span>
            <span className="cofre__note-card__date-text">Quinta-Feira, 02 De Abril</span>
          </div>
          
          <textarea
            className="cofre__note-card__textarea"
            placeholder="Como você está se sentindo hoje? Este espaço é só seu..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          
          <div className="cofre__note-card__footer">
            <span className="cofre__note-card__counter">
              {texto.length} caracteres
            </span>
            <Button variant="primary" size="md">
              Guardar no Cofre
            </Button>
          </div>
        </div>

      
        <div className="cofre__annotations">
          <div className="cofre__annotations__header">
            <div className="cofre__annotations__border"></div>
            <h2 className="cofre__annotations__title">Anotações Anteriores</h2>
          </div>

          <div className="cofre__annotations__list">
            {notasAntigas.map((note) => (
              <div key={note.id} className="cofre__annotations__item">
                <div className="cofre__annotations__item-header">
                  <h3 className="cofre__annotations__item-title">{note.date}</h3>
                  <ChevronDown size={18} color="#4b5563" />
                </div>
                <p className="cofre__annotations__item-text">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cofre;