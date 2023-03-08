import React, { useState } from "react";
import { SectionList } from "react-native";
import { Heading, VStack} from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History(){
  const [exercises, setExercises] = useState([{
    title: '26.08.22',
    data: ['Puxada Frontal', 'Remada Alta', 'Remada Baixa']
  },
  {
    title: '25.08.22',
    data: ['Puxada Frontal']
  }
]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios"/>

      <SectionList 
        sections={exercises}
        keyExtractor={item => item }
        renderItem={({ item }) => (
        <HistoryCard />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color='gray.200' fontSize='md'>
            {section.title}
          </Heading>
        )}
      />
    </VStack>
  );
} 