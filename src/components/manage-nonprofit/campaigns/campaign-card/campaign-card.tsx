import { useMemo } from 'react';
import { formatDateForHumans } from 'core/helpers';
import { Card } from 'components/card/card';
import type { AccountOrganization, AccountCampaign } from 'core/api/types';

type CampaignCardProps = {
  className?: string;
  campaign: AccountCampaign;
  organization: AccountOrganization;
};

export function CampaignCard({
  className,
  campaign,
  organization,
}: CampaignCardProps) {
  const campaignHref = useMemo(() => {
    return {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/campaigns/[campaignUuid]/',
      query: {
        organizationSlug: organization.slug,
        campaignUuid: campaign.uuid,
      },
    };
  }, [campaign, organization]);

  const details = useMemo(() => {
    return [
      {
        key: 'updated on',
        value: formatDateForHumans({
          date: campaign.updated_at,
          isMonthShort: true,
        }),
      },
      {
        key: 'published',
        value: campaign.is_draft ? 'no' : 'yes',
      },
      {
        key: 'public',
        value: campaign.is_public ? 'yes' : 'no',
      },
      {
        key: 'items',
        value: `${campaign.products_count}`,
      },
    ];
  }, [campaign]);

  return (
    <Card
      className={className}
      href={campaignHref}
      image={campaign.banner}
      title={campaign.name}
      description={campaign.meta_description}
      details={details}
    />
  );
}
