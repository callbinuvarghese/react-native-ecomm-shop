import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useCartStore } from '@/lib/store';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
        }}
      />
    </Tabs>
  );
}
