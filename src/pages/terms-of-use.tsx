import styles from 'styles/pages/terms-of-use.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import {
  Breadcrumbs,
  getHomeCrumb,
  getTermsOfUseCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const PrivacyPolicy: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getTermsOfUseCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Terms of Use | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.termsOfUse}>
            <header>
              <h2 className={styles.header}>Terms of Use</h2>
              <p className={styles.effectiveFrom}>Effective June 19, 2022</p>
            </header>

            <p>
              Thank you for visiting the Shortage website (the
              &ldquo;Site&rdquo;). Please read these Terms of Use carefully
              before using this Site. By accessing this Site in any manner
              (whether automated or otherwise), you agree to be bound by these
              Terms of Use and any additional terms and conditions that are
              referenced below or otherwise may apply to specific areas of this
              Site.
            </p>

            <p>
              You represent that you are legally able to accept these Terms of
              Use, and affirm that you are of legal age to form a binding
              contract. If you do not agree to these Terms of Use, you may not
              use this Site.
            </p>

            <h4 className={styles.sectionHeader}>What Is Shortage.Global?</h4>

            <p>
              At Shortage (&ldquo;Shortage&rdquo;, also referred to as
              &ldquo;we&rdquo;, &ldquo;us,&rdquo; &ldquo;our&rdquo; and other
              similar pronouns), our mission is to fulfill the needs of
              nonprofits with requested goods. The Shortage website is an online
              portal for individuals, institutions, and companies (collectively,
              the &ldquo;Donors&rdquo;) to purchase goods and donate them to
              partnered nonprofit organizations.
            </p>

            <p>
              The information provided about Shortage is subject to change and
              neither Shortage nor its corporate partners can accept any
              liability in respect to the information provided by a user or for
              the activities they undertake.
            </p>

            <h4 className={styles.sectionHeader}>
              Donations &amp; Payment Processing
            </h4>

            <p>
              All payments to Shortage ( excluding fees of the third parties)
              will be used to buy requested goods for the benefit of our
              partnered nonprofit organizations with a mission to fulfill the
              needs of Donees with product donations.
            </p>

            <p>
              All in-kind donations via Shortage ( excluding fees of the third
              parties) will be used for the benefit of our partnered nonprofit
              organizations with a mission to fulfill the needs of Donees with
              product donations.
            </p>

            <h4 className={styles.sectionHeader}>Currency</h4>

            <p>
              Payments are accepted only in US Dollars. All fees and charges set
              out in these Terms of Use are based on donations and payments
              being made only in US Dollars.
            </p>

            <h4 className={styles.sectionHeader}>Use Of The Site</h4>

            <p>
              Site users may not utilize the Site for the following activities:
            </p>

            <ul>
              <li>
                &ldquo;harvesting&rdquo; (or collecting) information from the
                Site using an automated software tool or manually on a mass
                basis. This includes, for example, information about other users
                of the Site and information about the offerings, products, and
                services available on the Site;
              </li>
              <li>
                using automated means to access the Site, or gaining
                unauthorized access to the Site or to any account or computer
                system connected to the Site;
              </li>
              <li>
                obtaining, or attempting to obtain, access to areas of the Site
                or our systems that are not intended for access by you;
              </li>
              <li>
                &ldquo;flooding&rdquo; the Site with requests or otherwise
                overburdening, disrupting or harming the Site or its systems;
              </li>
              <li>
                circumventing or reverse engineering the Site or its systems;
              </li>
              <li>violating any law, statute, ordinance or regulation;</li>
              <li>
                disseminating or posting anything unlawful, harassing, libelous,
                abusive, threatening, harmful, vulgar, obscene, or otherwise
                objectionable or using any material that could result in any of
                these;
              </li>
              <li>
                transmitting any material that encourages conduct constituting a
                criminal offence, or otherwise breaches any applicable laws,
                regulations or code of practice;
              </li>
              <li>
                interfering with any other person&rsquo;s use or enjoyment of
                the Site;
              </li>
              <li>advertising or soliciting business;</li>
              <li>
                creating, transmitting or storing electronic copies of materials
                protected by another&rsquo;s intellectual property rights
                without the permission of the owner; or
              </li>
              <li>
                any other purpose that is unlawful or likely to harm or bring
                Shortage into disrepute.
              </li>
            </ul>
            <p>
              You also must comply with all applicable laws and contractual
              obligations when you use this Site.
            </p>

            <h4 className={styles.sectionHeader}>
              Ownership Of Site Content And Submissions
            </h4>

            <p>
              We or our licensors or partners own the intellectual property
              rights in the content and materials displayed on the Site. You may
              use the Site (including such content and materials) for
              not-for-profit, non-commercial use, but you may not use it for
              commercial purposes. We reserve the right to revoke your right to
              use the Site content and materials upon notice. If you receive
              such a notice from us, you agree to discontinue such use of the
              Site. You may not modify, copy, reproduce, republish, upload,
              post, transmit, translate, sell, create derivative works, exploit,
              or distribute in any manner or medium (including by email or other
              electronic means) any material from this Site unless explicitly
              authorized in these Terms of Use, such as in this section or in
              the Social Networking section below, or by the owner of the
              materials.
            </p>

            <p>
              If you submit or post any materials or content to this Site, you
              grant us a royalty free, perpetual, irrevocable, transferable,
              assignable, sub-licensable, worldwide license to use such
              materials and content, including alterations thereof, for our
              business purposes, in any form, in any media, and via any
              technology we choose, whether it exists now or is created in the
              future. You represent that any materials and content posted or
              otherwise submitted by you to the Site is original to you and that
              you have the right to grant us these rights. Furthermore, you
              understand that when you submit or post material to a public area
              of our Site, you are allowing all users of the Site to access and
              repost such materials or content.
            </p>

            <p>
              Please do not send us your ideas for our business. We are always
              thinking and creating, and we may have similar ideas of our own.
              To avoid any disputes between us relating to ideas that you have
              submitted to us you agree that, if you send us your ideas, you are
              giving us the right to use them, and you waive and release us from
              claims that we have used your ideas without your permission.
            </p>

            <h4 className={styles.sectionHeader}>
              Responsibility For Public Postings And Content
            </h4>

            <p>
              Responsibility for what is posted in public areas of our Site lies
              with each user &ndash; you alone are responsible for the material
              you post or otherwise make available in public areas of our Site.
              You alone are responsible for assessing the credibility of other
              user postings. We do not control the material that you or others
              may post or otherwise make available in such areas, and you
              understand that we have no obligation to monitor any such material
              or to edit or delete it. However, we reserve the right do so. We
              are not a publisher of user posts, and we are not responsible for
              their accuracy or legality.
            </p>

            <p>
              &nbsp;You also understand and agree that any action or inaction by
              us or any of our volunteers, directors, officers, employees,
              consultants, agents, service or content providers,
              representatives, or other users (collectively, &ldquo;Our
              Representatives&rdquo;) to prevent, restrict, redress or regulate
              content, or to implement other enforcement measures against any
              content, conduct or potential Terms of Use violation is undertaken
              voluntarily and in good faith, and you expressly agree that
              neither we nor any of Our Representatives shall be liable to you
              or anyone else for any action or inaction to prevent, restrict,
              redress, or regulate content, or to implement other enforcement
              measures against any content, conduct or potential violation of
              these Terms of Use.
            </p>

            <h4 className={styles.sectionHeader}>Social Networking</h4>

            <p>
              We also include tools on our Site that allow users to share and/or
              publicly post content or information from our Site to a
              user&rsquo;s profile on a third party social network or blog.
              Third party social networking platforms and blogging platforms
              have their own terms of use, and we encourage you to read them. We
              do not control any of these third-party web services or any of
              their content. You expressly acknowledge and agree that we are in
              no way responsible or liable for any such third-party services or
              features. YOUR CORRESPONDENCE AND BUSINESS DEALINGS WITH THIRD
              PARTIES FOUND THROUGH THE SERVICE ARE SOLELY BETWEEN YOU AND THE
              THIRD PARTY.
            </p>

            <h4 className={styles.sectionHeader}>
              Site Registration And Log In
            </h4>

            <p>
              To access certain features or areas of this Site, you may be
              required to provide personal and/or demographic information as
              part of a Site registration or log-in process. In addition,
              certain features of our Site are only available to our registered
              users, and to access those areas of the Site you will be required
              to log in using your username and password.
            </p>

            <p>
              You agree to provide true, accurate, current and complete
              information about yourself as prompted by the applicable
              registration or log-in form, and you are responsible for keeping
              such information up-to-date (this includes your contact
              information, so that we can reliably contact you). The information
              you submit must describe you (you may not impersonate another
              person or entity), and you may not sell, share or otherwise
              transfer your account information.
            </p>

            <p>
              You are responsible for all activity occurring when this Site is
              accessed through your account, whether authorized by you or not.
              Therefore, if you create an account, be sure to protect the
              confidentiality of your account password. We are not liable for
              any loss or damage arising from your failure to protect your
              password or account information.
            </p>

            <h4 className={styles.sectionHeader}>Communications</h4>

            <p>
              The communications between you and us via this Site use electronic
              means, whether you visit this Site or send us an email, or whether
              we post notices on this Site or communicate with you via email.
              For contractual purposes, you consent to receive communications
              from us in an electronic form, and you agree that all terms and
              conditions, agreements, notices, disclosures, and other
              communications that we provide to you electronically satisfy any
              legal requirement that such communications would satisfy if it
              were in writing. The foregoing does not affect your non-waivable
              rights.
            </p>

            <p>
              By making a payment to Shortage, Donors agree to have their email
              address added to our house email list, which they may unsubscribe
              from at any time by sending an email to{' '}
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>{' '}
              indicating their desire to unsubscribe, or clicking
              &ldquo;unsubscribe&rdquo; in the footer of the email. Please note,
              there are some circumstances (e.g., organizational audits) when we
              will need to contact a user even if they unsubscribe. Users also
              agree to be contacted in this case even if they have unsubscribed.
            </p>

            <h4 className={styles.sectionHeader}>Linking Policies</h4>

            <p>
              This Site may contain links to other websites. Such links are
              provided for your convenience only, and you access them at your
              own risk. We are not responsible for, and do not endorse, the
              content of any such websites, or the products and services sold on
              them, nor do we take responsibility for the accuracy of any such
              websites. When you visit a linked website you should read the
              terms of use and privacy policy that govern that particular linked
              website.
            </p>

            <p>
              While we welcome links to this Site, Shortage is not responsible
              for the links shared on social media that link back to our Site
              nor are we responsible for the content of those pages. We
              encourage individuals to practice safe social media practices
              online and use caution when identifying themselves. We reserve the
              right to revoke your right to link to this site upon notice. If
              you receive such a notice from us, you agree to discontinue your
              link to the site.
            </p>

            <h4 className={styles.sectionHeader}>
              Children Under The Age Of 13
            </h4>

            <p>
              This Site is not intended for children under 13 years of age.
              Shortage does not knowingly collect personal information from
              children under 13.
            </p>

            <h4 className={styles.sectionHeader}>
              Disclosure Or Transfer Of Data In Connection With Organization
              Change
            </h4>

            <p>
              We may disclose personal information that we collect or a user
              provides to any buyer or other successor in the event of a merger,
              divestiture, restructuring, reorganization, dissolution or other
              sale or transfer of some or all of our assets, whether as a going
              concern or as part of bankruptcy, liquidation or similar
              proceeding, in which personal information held by us about our
              Site users is among the assets transferred.
            </p>

            <h4 className={styles.sectionHeader}>
              Copyright Infringement Notices
            </h4>

            <p>
              If you are a copyright owner who believes in good faith that your
              copyrighted material has been reproduced, posted or distributed on
              this Site in a manner that constitutes copyright infringement,
              please inform our designated copyright agent by sending email to{' '}
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>
              . Please include the following information in your written notice:
              (1) a detailed description of the copyrighted work that is
              allegedly infringed upon; (2) a description of the location of the
              allegedly infringing material on the Site; (3) your contact
              information, including your address, telephone number, and, if
              available, email address; (4) a statement by you indicating that
              you have a good-faith belief that the allegedly infringing use is
              not authorized by the copyright owner, its agent, or the law; (5)
              a statement by you, made under penalty of perjury, affirming that
              the information in your notice is accurate and that you are
              authorized to act on the copyright owner&rsquo;s behalf; and (6)
              an electronic or physical signature of the copyright owner or
              someone authorized on the owner&rsquo;s behalf to assert
              infringement of copyright and to submit the statement. Please note
              that the contact information provided in this paragraph is for
              suspected copyright infringement only. Contact information for
              other matters is provided elsewhere in these Terms of Use or on
              the Site. We have a policy of terminating the Site usage
              privileges of users who are repeat infringers of intellectual
              property rights.
            </p>

            <h4 className={styles.sectionHeader}>Changes To This Site</h4>

            <p>
              We reserve the right to make changes to, or to suspend or
              discontinue (temporarily or permanently), this Site or any portion
              of this Site. You agree that we will not be liable to you or to
              any third party for any such modification, suspension or
              discontinuance.
            </p>

            <h4 className={styles.sectionHeader}>
              Suspension Or Termination Of Access
            </h4>

            <p>
              We have the right to deny access to, and to suspend or terminate
              your access to, the Site, or to any features or portions of the
              Site, and to remove and discard any content or materials you have
              submitted to the Site, at any time and for any reason, including
              for any violation by you of these Terms of Use. In addition, we
              have a policy of terminating the Site usage privileges of users
              who are repeat infringers of intellectual property rights. In the
              event that we suspend or terminate your access to and/or use of
              the Site, you will continue to be bound by the Terms of Use that
              were in effect as of the date of your suspension or termination.
            </p>

            <h4 className={styles.sectionHeader}>Indemnification</h4>

            <p>
              You agree to indemnify, defend and hold us and our volunteers,
              directors, officers, employees, consultants, agents, service and
              content providers, representatives, donors, and other users
              harmless from and against any claims, liabilities, losses,
              damages, costs and expenses, including reasonable attorneys&rsquo;
              fees, arising from your use of this Site, your submissions to this
              Site, your donations, your receipt of donations, your interactions
              with other Donees or Donors, or any violation of these Terms of
              Use, or applicable law, by you or by someone accessing the Site
              via your account. We reserve the right, at our own expense, to
              assume the exclusive defense and control of any matter subject to
              indemnification by you, in which event you agree to cooperate with
              us in defending such claims. This indemnification, defense and
              hold harmless obligation will survive these Terms of Use and the
              termination of your use of this Site.
            </p>

            <h4 className={styles.sectionHeader}>Jurisdictional Issues</h4>

            <p>
              We control and operate this Site from our facilities in the United
              States of America, and unless otherwise specified, the materials
              displayed on this Site are presented solely for the purpose of
              promoting products and services available in the United States,
              its territories, possessions, and protectorates. We do not
              represent that materials on this Site are appropriate or available
              for use in other locations. If you choose to access this Site from
              other locations, you are responsible for compliance with local
              laws, if and to the extent local laws are applicable.
            </p>

            <h4 className={styles.sectionHeader}>
              Applicable Law; No Waiver; Severability
            </h4>

            <p>
              These Terms of Use, and the relationship between you and us, will
              be governed by the laws of the United States and the Commonwealth
              of Delaware without giving effect to any principles of conflicts
              of law. Our failure to exercise or enforce any right or provision
              of these Terms of Use will not constitute a waiver of such right
              or provision.
            </p>

            <p>
              In the event that a provision of these Terms of Use is found to be
              unlawful, conflicting with another provision of the Terms of Use,
              or otherwise unenforceable, you and we nevertheless agree that the
              court should endeavor to give effect to intentions as reflected in
              the provision, and the other provisions in the Terms of Use will
              remain in full force and effect. If two or more provisions are
              deemed to conflict with each other&rsquo;s operation, Shortage
              shall have the sole right to elect which provision remains in
              force.
            </p>

            <h4 className={styles.sectionHeader}>Governing Jurisdiction</h4>

            <p>
              ANY DISPUTE NOT INITIATED IN SMALL CLAIMS COURT WILL BE LITIGATED
              IN A COURT OF COMPETENT JURISDICTION ONLY IN A FEDERAL OR STATE
              COURT SITTING IN THE COMMONWEALTH OF DELAWARE. EACH PARTY SUBMITS
              TO THE EXCLUSIVE JURISDICTION OF THESE COURTS AND AGREES NOT TO
              COMMENCE ANY LEGAL ACTION UNDER OR IN CONNECTION WITH THE SUBJECT
              MATTER OF THIS TERMS OF USE IN ANY OTHER COURT OR FORUM. EACH
              PARTY WAIVES ANY OBJECTION TO THE LAYING OF THE VENUE OF ANY LEGAL
              ACTION BROUGHT UNDER OR IN CONNECTION WITH THE SUBJECT MATTER OF
              THIS TERMS OF USE IN THE FEDERAL OR STATE COURTS SITTING IN THE
              COMMONWEALTH OF DELAWARE, AND AGREES NOT TO PLEAD OR CLAIM IN SUCH
              COURTS THAT ANY SUCH ACTION HAS BEEN BROUGHT IN AN INCONVENIENT
              FORUM.
            </p>

            <h4 className={styles.sectionHeader}>Security</h4>

            <p>
              While we endeavor to protect the security and integrity of
              sensitive personal information collected via this Site, due to the
              inherent nature of the Internet as an open global communications
              vehicle, we cannot guarantee that any information, during
              transmission through the Internet or while stored on our system or
              otherwise in our care, will be absolutely safe from intrusion by
              others, such as hackers.
            </p>

            <p>
              If you correspond with us by e-mail, text message, or using Web
              forms and LifeChaton on our Site, you should be aware that your
              transmission might not be secure. A third party could view the
              information you send in transit by such means. We will have no
              liability for disclosure of your information due to errors or
              unauthorized acts of third parties during or after transmission.
            </p>

            <p>
              If you create an account on our Site, you are responsible for
              maintaining the strict confidentiality of your account password,
              and you shall be responsible for any activity that occurs using
              your account credentials, whether or not you authorized such
              activity. Please notify us of any unauthorized use of your
              password or account or any other breach of security.
            </p>

            <p>
              If we believe that the security of your personal information in
              our care may have been compromised, we may seek to notify you of
              that development. If a notification is appropriate, we will
              endeavor to notify you as promptly as possible under the
              circumstances. If we have your e-mail address, we may notify you
              by e-mail.
              <strong>
                You consent to our use of e-mail as a means of such
                notification.
              </strong>
              <strong>
                If you prefer for us to use the U.S. Postal Service to notify
                you in this situation, please e-mail us at{' '}
              </strong>
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>
              <strong>.</strong>
            </p>

            <h4 className={styles.sectionHeader}>Disclaimer Of Warranties</h4>

            <p>
              WE PROVIDE THIS SITE ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; BASIS, WITHOUT WARRANTY OF ANY KIND WHETHER
              EXPRESS OR IMPLIED (INCLUDING WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR ANY PARTICULAR PURPOSE AND NON-INFRINGEMENT). THIS
              MEANS THAT WE MAKE NO PROMISES THAT:
            </p>

            <ul>
              <li>THE SITE WILL BE AVAILABLE AT ANY PARTICULAR TIME,</li>
              <li>
                THE SITE WILL MEET ANY PARTICULAR REQUIREMENTS OR PROVIDE ANY
                PARTICULAR RESULTS,
              </li>
              <li>
                THE INFORMATION ON THE SITE WILL BE ACCURATE OR UP-TO-DATE,
              </li>
              <li>
                THE SITE OR THE INFORMATION TRANSMITTED TO OR FROM IT OR STORED
                ON IT WILL BE SECURE FROM UNAUTHORIZED ACCESS,
              </li>
              <li>
                INFORMATION AND MATERIALS THAT YOU STORE IN YOUR ACCOUNT OR ON
                THIS SITE WILL REMAIN RETRIEVABLE AND UNCORRUPTED, OR
              </li>
              <li>
                THE SITE WILL BE UNINTERRUPTED OR ERROR-FREE OR WILL BE FREE OF
                VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT DEFECTS WILL BE
                CORRECTED.
              </li>
            </ul>
            <p>
              WE LIKEWISE MAKE NO WARRANTIES OR REPRESENTATIONS REGARDING ANY
              PRODUCTS OR SERVICES ORDERED OR PROVIDED VIA THIS SITE. ANY
              PRODUCTS AND SERVICES ORDERED OR PROVIDED VIA THIS SITE ARE
              PROVIDED &ldquo;AS IS&rdquo;, EXCEPT TO THE EXTENT, IF AT ALL,
              OTHERWISE SET FORTH IN A SEPARATE AGREEMENT ENTERED INTO DIRECTLY
              BETWEEN YOU AND A THIRD PARTY PROVIDER OF SUCH PRODUCT OR SERVICE.
              You hereby waive any claims against us arising from products or
              services donated by Donors and release us from any such claims.
            </p>

            <p>
              YOU AGREE THAT USE OF THIS SITE IS AT YOUR OWN RISK. ALTHOUGH WE
              TRY TO ENSURE THAT THE INFORMATION POSTED ON THIS SITE IS ACCURATE
              AND UP-TO-DATE, WE RESERVE THE RIGHT TO CHANGE OR MAKE CORRECTIONS
              TO ANY OF THE INFORMATION AT ANY TIME, including for example,
              pricing. WE CANNOT, AND DO NOT, GUARANTEE THE CORRECTNESS,
              TIMELINESS, PRECISION, THOROUGHNESS OR COMPLETENESS OF ANY OF THE
              INFORMATION AVAILABLE ON THIS SITE, NOR WILL WE BE LIABLE FOR ANY
              INACCURACY OR OMISSION CONCERNING ANY OF THE INFORMATION PROVIDED
              ON THIS SITE. NO ADVICE, RESULTS OR INFORMATION, WHETHER ORAL OR
              WRITTEN, OBTAINED BY YOU FROM US OR THROUGH THE SITE SHALL CREATE
              ANY WARRANTY NOT EXPRESSLY MADE HEREIN. WE HEREBY DISCLAIM, AND
              YOU HEREBY WAIVE, ANY AND ALL WARRANTIES AND REPRESENTATIONS MADE
              IN WEBSITE DOCUMENTATION, FREQUENTLY ASKED QUESTIONS DOCUMENTS,
              SUPPORT DOCUMENTATION, BY OUR PERSONNEL, AND OTHERWISE ON THE SITE
              OR IN CORRESPONDENCE WITH US OR OUR AGENTS. WE ARE NOT RESPONSIBLE
              FOR ANY CONTENT OR MATERIALS POSTED TO OUR SITE BY USERS, NOR FOR
              DISPUTES BETWEEN USERS, OR BETWEEN USERS AND THIRD PARTIES.
            </p>

            <p>
              THESE DISCLAIMERS APPLY TO US AND OUR RELATED COMPANIES AS WELL AS
              THIRD PARTIES THAT ARE INVOLVED IN THE CREATION, PRODUCTION, OR
              DISTRIBUTION OF THE SITE, AND THE PRODUCTS AND SERVICES AVAILABLE
              THROUGH THE SITE, AND ANY OF THEIR EMPLOYEES AND AGENTS.
            </p>

            <h4 className={styles.sectionHeader}>Limitations Of Liability</h4>

            <p>
              IF YOU ARE DISSATISFIED WITH THIS SITE, OR ANY MATERIALS,
              PRODUCTS, OR SERVICES ON THIS SITE, OR WITH ANY OF THE
              SITE&rsquo;S TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO
              DISCONTINUE USING THE SITE.
            </p>

            <p>
              IN NO EVENT WILL WE OR ANY OF our volunteers, directors, officers,
              employees, consultants, agents, service or content providers,
              representatives, DONORS, OR OTHER USERS, BE LIABLE FOR ANY DAMAGES
              (INCLUDING, WITHOUT LIMITATION, DIRECT, INDIRECT, SPECIAL,
              INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES) ARISING
              FROM, OR DIRECTLY OR INDIRECTLY RELATED TO, THE USE OF, OR THE
              INABILITY TO USE, THIS SITE (OR THE CONTENT, MATERIALS AND
              FUNCTIONS PROVIDED AS PART OF THIS SITE), WHETHER IN AN ACTION OF
              CONTRACT, NEGLIGENCE, OR STRICT LIABILITY, EVEN IF WE KNEW, SHOULD
              HAVE KNOWN OR HAD BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              BECAUSE SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
              CERTAIN CATEGORIES OF DAMAGES, THE ABOVE LIMITATIONS MAY NOT APPLY
              TO YOU. IN SUCH STATES, OUR LIABILITY AND THE LIABILITY OF our
              volunteers, directors, officers, employees, consultants, agents,
              service or content providers, representatives, DONORS, OR OTHER
              USERS, IS LIMITED TO THE FULLEST EXTENT PERMITTED BY SUCH STATE
              LAW.
            </p>

            <h4 className={styles.sectionHeader}>
              Changes To The Terms Of Use
            </h4>

            <p>
              Shortage periodically reviews and updates these Terms of Use and
              reserves the right to do so at any time. Such changes will be
              effective when posted. By continuing to access or use this Site
              after those changes become effective, you agree to be bound by the
              Terms of Use as modified.
            </p>

            <h4 className={styles.sectionHeader}>Other</h4>

            <p>
              These Terms of Use, any additional terms and conditions that are
              referenced herein or otherwise may apply to specific areas of this
              Site, constitute the entire agreement between us and you with
              respect to this Site. This agreement is personal to you and you
              may not assign it to anyone. These Terms of Use are not intended
              to benefit any third party, and do not create any third party
              beneficiaries. Accordingly, these Terms of Use may only be invoked
              or enforced by you or us.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
