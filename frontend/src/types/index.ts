import { z } from 'zod';

export const MetricSchema = z.enum(['ROAS', 'CTR', 'CPC', 'Spend']);
export const OperatorSchema = z.enum(['<', '>', '=']);
export const ActionSchema = z.enum(['pause', 'notify', 'scale_up']);

export const RuleSchema = z.object({
  metric: MetricSchema,
  operator: OperatorSchema,
  value: z.number(),
  action: ActionSchema,
});

export const AudienceSchema = z.object({
  country: z.string(),
  device: z.enum(['mobile', 'desktop', 'tablet', 'all']),
  ageRange: z.string(),
});

export const CampaignSchema = z.object({
  name: z.string().min(1),
  budget: z.number().positive(),
  audience: AudienceSchema,
  rule: RuleSchema,
});

export type Metric = z.infer<typeof MetricSchema>;
export type Operator = z.infer<typeof OperatorSchema>;
export type Action = z.infer<typeof ActionSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type Audience = z.infer<typeof AudienceSchema>;
export type Campaign = z.infer<typeof CampaignSchema> & { id: string };
