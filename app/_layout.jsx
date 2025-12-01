import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Muscle Matrix',
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{
          title: 'About',
        }} 
      />
      <Stack.Screen 
        name="exerciseDetail" 
        options={{
          title: 'Exercise Details',
        }} 
      />
    </Stack>
  );
}