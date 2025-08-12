import { Feather } from '@expo/vector-icons'

export const icon = {
  index: (prop: any) => <Feather name="home" size={24} color={prop?.color ?? '#222'} />,
  chart: (prop: any) => <Feather name="bar-chart-2" size={24} color={prop?.color ?? '#222'} />,
  setting: (prop: any) => <Feather name="settings" size={24} color={prop?.color ?? '#222'} />,
}
