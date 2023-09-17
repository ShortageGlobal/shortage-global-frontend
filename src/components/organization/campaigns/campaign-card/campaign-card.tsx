import cardStyles from 'components/card/card.module.scss';
import { useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { Card } from 'components/card/card';
import type { OrganizationPreview, CampaignPreview } from 'core/api/types';

type CampaignCardProps = {
  organization: OrganizationPreview;
  campaign: CampaignPreview;
  isVertical?: boolean;
};

export function CampaignCard({
  organization,
  campaign,
  isVertical = false,
}: CampaignCardProps) {
  const campaignHref = useMemo(() => {
    return {
      pathname: '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]/',
      query: {
        organizationSlug: organization.slug,
        campaignSlug: campaign.slug,
        campaignUuid: campaign.uuid,
      },
    };
  }, [campaign]);

  const details = useMemo(() => {
    return [
      {
        key: 'Requested Items',
        value: `${campaign.products_count}`,
      },
    ];
  }, [campaign]);

  return (
    <Card
      isVertical={isVertical}
      href={campaignHref}
      image={campaign.banner}
      imageExtra={
        campaign.is_draft ? (
          <Badge className={cardStyles.imageBadge} bg="secondary">
            Draft
          </Badge>
        ) : null
      }
      title={campaign.name}
      details={details}
    />
  );
}
