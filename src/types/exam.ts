export type CardType = {
  name: string;
  date: string;
};
export interface ResErrorData {
  message: string;
}
export type Term = {
  id: string;
  termExamSub: string;
  name: string;
  batchConfigurationId: string;
  date: string;
  cards: CardType[];
};
interface Card {
  name: string;
  date: string;  
}

export interface TermData {
  name: string;
  termExamSub: string;
  batchConfigurationId: string;
  date: string;  
  cards: Card[];
}

export interface Subject {
  id: string;                
  subjectId: string;        
  createdAt: string;         
  updatedAt: string;         
  examConfigurationId: string; 
}



