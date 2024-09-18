import React from 'react';
import { TabBarIcon } from "../components/navigation/TabBarIcon";

export const icon: { [key: string]: (props: any) => JSX.Element } = {
    pantry: (props: any) => <TabBarIcon name="home" {...props} />,
    list: (props: any) => <TabBarIcon name="list" {...props} />,
    scanner: (props: any) => <TabBarIcon name="scan" {...props} />,
    recipes: (props: any) => <TabBarIcon name="book" {...props} />,
    profile: (props: any) => <TabBarIcon name="person" {...props} />
}