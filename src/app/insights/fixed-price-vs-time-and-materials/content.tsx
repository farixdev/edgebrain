"use client";

import Link from "next/link";
import { ArticleLayout } from "@/components/ui/article-layout";

/**
 * Body copy only.
 *
 * ArticleLayout owns the H1, breadcrumbs, byline, disclosure, prose styling,
 * "Keep reading" block and closing CTA — all read from the registry entry for
 * this slug. Nothing here re-types the title, and nothing here adds its own
 * Section or reveal wrapper: the layout already wraps the whole body in one
 * `data-reveal`/`initial={false}` motion.div, so every word ships in the
 * server HTML.
 *
 * Number discipline, per the standing disclosure the layout renders above this:
 * the only prices named are ones already published on /services — the $2,500
 * minimum engagement, the $3,500 readiness sprint, the $6,000 fixed-scope
 * floor with its $12,000-$35,000 typical band, and the $1,800 retainer floor.
 * Every other figure (buffer percentages, milestone counts, holdback sizes) is
 * explicitly labelled as our own working practice, because that is what it is.
 * There is no measured client outcome in this piece and none should be added.
 */
export function FixedPriceVsTimeAndMaterialsContent() {
  return (
    <ArticleLayout slug="fixed-price-vs-time-and-materials">
      <p>
        <strong>
          Fixed price is not a discount. It is insurance, and you pay the
          premium.
        </strong>{" "}
        A fixed bid moves estimation risk from your side of the table to the
        vendor&rsquo;s, and the vendor prices that move &mdash; commonly a
        buffer in the region of 15 to 30 percent sitting inside the number,
        which you pay whether or not the risk ever lands. Time and materials
        leaves the risk with you and costs less when the work goes well. So the
        real question is not which model is cheaper. It is whether your scope is
        settled enough for anyone to price it honestly.
      </p>
      <p>
        We sell fixed scope. Read what follows as testimony from a hostile
        witness &mdash; the half of the argument that runs against our own book,
        including when to refuse a fixed quote from us.
      </p>

      <h2>What you are actually buying when you buy a fixed price</h2>
      <p>
        Three things, and only one of them is code. A number you can take to a
        board without a range attached. A date. And a transfer of estimation
        risk: if the payments integration takes three weeks instead of one, that
        is the vendor&rsquo;s problem rather than a conversation about your
        budget.
      </p>
      <p>
        The third item is the one with a price on it. Nobody absorbs unbounded
        downside for free, and a firm that appears to be doing so is either
        mispricing the work or planning to win the money back through change
        orders.
      </p>

      <h3>How the buffer gets sized</h3>
      <p>
        A competent estimator builds the work up task by task, then adds
        contingency in proportion to what they do not know. Our own working
        bands, stated as ours: roughly 10 to 15 percent on work the team has
        shipped many times with settled inputs, and 25 to 40 percent where a
        third-party integration, an unseen production dataset, or an unnamed
        compliance reviewer sits inside the scope.
      </p>
      <p>
        The buffer also compounds &mdash; task estimates get padded, then a
        project-level contingency lands on top of the padded total &mdash; and
        it covers more than engineering risk. It prices in the client who takes
        nine days to answer a blocking question. That part is the cheapest for
        you to remove.
      </p>

      <h3>What shrinks the buffer</h3>
      <p>
        Four artefacts do most of the work. Hand them over before the estimate,
        not after.
      </p>
      <ul>
        <li>
          <strong>A settled data model.</strong> The entities, the relationships
          between them, and which system holds the source of truth for each
          field. Not a migration file &mdash; a document that could become one
          in a day.
        </li>
        <li>
          <strong>A decided auth story.</strong> The distance between
          &ldquo;users log in&rdquo; and &ldquo;enterprise SSO over SAML, with
          SCIM provisioning and role inheritance across tenants&rdquo; is weeks
          of work, and the sentence in your brief is almost always the first
          one.
        </li>
        <li>
          <strong>Designs that exist.</strong> Not a moodboard and not three
          reference sites. Screens, plus the empty state, the error state, and
          the narrow breakpoint. An undesigned screen is estimated as the
          average of everything that word could mean.
        </li>
        <li>
          <strong>Integration endpoints with credentials in hand.</strong>{" "}
          Sandbox access to the CRM, the payment processor, the ERP, before the
          quote is written. An integration described in prose is priced as risk.
          One whose sandbox the estimator has opened is priced as work.
        </li>
      </ul>
      <p>
        Then run the test that tells you who you are dealing with: supply those
        four things and ask for a re-quote. If the number does not move, the
        buffer was never contingency. It was margin. The same inputs are what
        swing an early-stage estimate around, which we took apart in{" "}
        <Link href="/insights/mvp-development-cost">
          what building an MVP actually costs
        </Link>
        .
      </p>

      <h2>What time and materials actually costs you</h2>
      <p>
        The buffer disappears and the risk comes home. You pay for hours worked,
        so when the estimate turns out to have been pessimistic you keep the
        difference &mdash; which is why buyers with their own technical
        leadership tend to prefer it.
      </p>
      <p>
        The failure mode is not the overrun. It is drift. A fixed bid contains a
        forcing function: somebody has to say no, and the contract says who.
        Under time and materials the work continues because it is able to, and
        three months later nobody can point at the decision that added the third
        dashboard. T&amp;M fails quietly, in a burn report nobody reads.
      </p>

      <h3>The controls that make time and materials safe</h3>
      <p>Five, and they belong in the agreement, not in an onboarding call.</p>
      <ul>
        <li>
          A not-to-exceed cap, with written notice at 70 and again at 85 percent
          of it. A cap you first hear about on the day it is reached is a
          surprise, not a control.
        </li>
        <li>
          A weekly burn report by workstream, not a monthly invoice by
          headcount. Hours attached to features are reviewable. Hours attached
          to names are not.
        </li>
        <li>
          A fixed commitment per increment, so the flexibility lives between
          two-week blocks instead of inside them.
        </li>
        <li>
          Termination on two weeks&rsquo; notice, with the code in your
          repository and CI in your cloud account from the first commit.
        </li>
        <li>
          A rate card fixed for the term, with named individuals and notice
          before anyone is substituted. Silent substitution is how a senior
          quote becomes a junior team, one of the failures we set out in{" "}
          <Link href="/insights/in-house-vs-agency-vs-freelancer">
            our comparison of in-house, agency and freelance delivery
          </Link>
          .
        </li>
      </ul>

      <h2>The change order clause is where a fixed price lives or dies</h2>
      <p>
        Buyers read the price and the timeline. The clause that decides how the
        next six months feel is the one about changes, and it is the one that
        gets skimmed.
      </p>
      <p>
        The predictable failure: small requests arrive, nobody wants to invoice
        for twenty minutes, so they get absorbed, and absorption eats the
        buffer. Once it is gone the vendor starts refusing things, including
        reasonable things, and a client told yes for two months reads the first
        no as bad faith. Neither party did anything wrong. The contract never
        named a mechanism.
      </p>

      <h3>What a good scope exclusion looks like</h3>
      <p>
        A bad exclusion is a catch-all: &ldquo;excludes any work not described
        above.&rdquo; It reads as airtight and decides nothing, because the
        argument you will actually have is about whether a thing was described
        above. A good exclusion is specific, testable, and says what happens if
        you want the excluded thing anyway. As an illustration of the shape, not
        a quote from anyone&rsquo;s contract:
      </p>
      <blockquote>
        Authentication is email and password with a reset flow. SSO (SAML or
        OIDC), SCIM provisioning and directory sync are excluded. If required,
        they are quoted as a change order at the attached rate card and are
        estimated to add two to three weeks to the schedule.
      </blockquote>
      <p>
        Both sides now know the shape of the door before anyone walks through
        it. The same treatment belongs on the browser matrix, on data volume
        (&ldquo;the importer assumes CSV files up to 50,000 rows; larger files
        are a streaming importer and different work&rdquo;), on who writes the
        copy, on third-party licence fees, and on the load the system is built
        to hold.
      </p>

      <h3>The sentence that destroys a fixed-price relationship</h3>
      <p>
        &ldquo;&hellip;and any reasonable minor amendments.&rdquo; Also
        &ldquo;minor revisions as required&rdquo;, &ldquo;a reasonable number of
        rounds&rdquo;, and &ldquo;to the client&rsquo;s satisfaction&rdquo;.
        Every one is unbounded and undefined, and the two parties define it
        differently on the precise day it matters. The client reads a promise.
        The vendor reads typo fixes. Neither is lying, and there is nothing in
        the document to appeal to.
      </p>
      <p>
        Replace it with something countable. Two rounds of revision per screen,
        each round delivered as one consolidated list within five working days,
        further rounds billed at the rate card. Less pleasant to read, and
        enormously easier to live inside. A vendor who resists making it
        countable is protecting their ability to argue about it later.
      </p>

      <h3>The mechanics worth writing down</h3>
      <p>Five lines. They fit on half a page.</p>
      <ul>
        <li>
          <strong>Who raises and who approves.</strong> Named roles both sides,
          and a rule that a change without the named approver is not a change.
        </li>
        <li>
          <strong>Turnaround.</strong> The vendor responds within a stated
          number of working days with cost, schedule impact, and anything the
          change breaks downstream.
        </li>
        <li>
          <strong>Price basis.</strong> The rate card is fixed for the project
          term, so a change order cannot be priced opportunistically once you
          are committed and the code is half written.
        </li>
        <li>
          <strong>Schedule stated separately from cost.</strong> A change adding
          $4,000 and two days is a different decision from one adding $4,000 and
          three weeks. A blended number hides which you are approving.
        </li>
        <li>
          <strong>A running decision log.</strong> Request, decision, date,
          cost, approver. Most late disputes on fixed-price work are memory
          disputes, and a shared log ends them in ninety seconds.
        </li>
      </ul>

      <h2>Three clauses to read before you sign either model</h2>

      <h3>Acceptance, and the acceptance clock</h3>
      <p>
        A deliverable should be deemed accepted if it has not been rejected in
        writing inside a fixed window &mdash; five working days is normal
        &mdash; with the rejection citing specific written criteria. Without a
        clock, one stakeholder on holiday suspends a payment indefinitely.
        Without written criteria, &ldquo;it doesn&rsquo;t feel right&rdquo; is a
        valid rejection, and the definition of done belongs to whoever is most
        confident in the room.
      </p>

      <h3>IP assignment, and what triggers it</h3>
      <p>
        Read whether intellectual property transfers on payment or on delivery.
        On payment is normal and defensible. What matters more is what you hold
        in the meantime: the repository in your organisation, the cloud account
        in your name, the domain on your registrar, from the first week.
      </p>
      <p>
        If the only copy of your codebase lives on the vendor&rsquo;s
        infrastructure until the final invoice clears, you have not bought
        software. You have bought a position in a negotiation you did not know
        you were in. We push to the client&rsquo;s repository from the first
        commit on{" "}
        <Link href="/services/web-development">
          web platform and application work
        </Link>
        .
      </p>

      <h3>Termination, and what leaving costs</h3>
      <p>
        You want termination for convenience with notice, and what you owe on
        exit should be work completed plus work genuinely in progress &mdash;
        not the remaining contract value, which some fixed-price agreements
        quietly claim. Then name the handover as a deliverable: repository
        access, deployment documentation, credentials, and a call with the
        engineers who wrote it. State whether it is included or billed. It is
        the cheapest insurance in the document.
      </p>

      <h2>Milestone-based payment: tie money to behaviour, not phases</h2>
      <p>
        Milestones named after phases are unfalsifiable. &ldquo;Design
        complete&rdquo; and &ldquo;development complete&rdquo; are assertions,
        not tests, and arguing about whether they happened is the argument the
        milestone was supposed to prevent.
      </p>
      <p>
        A milestone should be a demonstrable behaviour on a URL you can open. As
        an illustration: a user can sign up, create an organisation, invite a
        second user, and both accounts see the same project list, on staging,
        today. Either that is true or it is not.
      </p>
      <p>
        Our own practice on sizing, offered as ours rather than as a standard.
        Three to five milestones on a project in the band our published rate
        card calls fixed scope &mdash; from $6,000, most landing between $12,000
        and $35,000 &mdash; and no more, because a twelve-milestone schedule on
        a three-month build is theatre both sides abandon by week four. Hold at
        least 20 percent to final acceptance; a closing tranche under about 10
        percent stops working as leverage, which is the only reason it exists.
      </p>

      <h2>Retainer versus project is a different question entirely</h2>
      <p>
        These get compared as rival billing models for the same work. They are
        not. A project buys a defined outcome and ends; a retainer buys capacity
        for a system that is already live. Our published rate card puts
        retainers from $1,800 a month and fixed-scope projects from $6,000, but
        price is not the deciding input. Whether the work has an end is. If it
        does, buy a project: a retainer finishes it more slowly and with less
        pressure on anyone.
      </p>
      <p>
        Retainers rot when nobody reviews them. Ask for a one-page monthly note
        listing what shipped, and set an explicit renew-or-stop decision at
        ninety days. A retainer nobody has audited in a year is a subscription
        to a feeling.
      </p>

      <h2>When a fixed price from us would be the wrong thing to buy</h2>
      <p>This is the section that costs us work.</p>
      <p>
        If discovery has not happened, our fixed price is fiction with
        contingency stapled to it, and you pay for our ignorance rather than we
        do. Decline a fixed bid, ours included, while any of these is open. No
        agreed data model. No decision on authentication. No designs. No
        credentials for the systems the build must integrate with. A stakeholder
        with veto power who has not yet seen anything.
      </p>
      <p>
        In that state a fixed price hurts you twice. You pay the fat end of the
        buffer, and you create a vendor financially motivated to read every
        ambiguous line of the scope narrowly &mdash; at exactly the moment you
        need it read generously. That incentive is structural, not a comment on
        anybody&rsquo;s integrity, ours included.
      </p>
      <p>
        The alternative is a small, paid, bounded discovery step that produces
        the four artefacts above, after which a fixed bid becomes honest. Our
        published readiness sprints start at $3,500 and exist for this, as part
        of{" "}
        <Link href="/services/ai-consulting">
          how we scope and de-risk a build before quoting it
        </Link>
        . If you would rather not buy that from us, buy it elsewhere or write it
        yourself over a fortnight. The artefacts are the point, not the invoice.
      </p>
      <p>
        And the case for buying nothing at all: if you cannot describe in one
        sentence the single workflow that has to work on launch day, no contract
        shape rescues you. Fixed price locks in the wrong build. Time and
        materials funds the search for the right one at full rate. Our published
        minimum engagement of $2,500 is not a small enough number to spend
        finding that out.
      </p>

      <h2>
        How to avoid scope creep without becoming your vendor&rsquo;s adversary
      </h2>
      <p>
        Scope creep is rarely malice. It is a missing forum &mdash; several
        people each asking for something small, through several channels, with
        nowhere for the requests to be seen together.
      </p>
      <p>
        Two mechanisms handle most of it. A parking lot both sides can read:
        every out-of-scope idea goes in with a date and a requester, nothing is
        refused, only deferred somewhere visible, and at the end of each
        increment you promote at most one item with a change order attached.
        Then one named approver &mdash; not a committee, not whoever emailed
        most recently. The best predictor of a calm fixed-price project we have
        seen is whether one person can say yes and have it stick.
      </p>
      <p>
        A rule we hold ourselves to, stated so the trade is visible: if a
        request takes under an hour and does not touch the data model, we do it
        and record it in the weekly note. Not generosity &mdash; invoicing
        eighty dollars costs more in goodwill than it collects. But it has a
        ceiling, because &ldquo;we&rsquo;ll just do it&rdquo; without one is how
        a fixed-price project becomes a loss, and a loss becomes an argument.
      </p>

      <h2>The compressed decision</h2>
      <p>
        Buy fixed price when the data model is settled, authentication is
        decided, designs exist and integration credentials are in hand &mdash;
        and buy it knowing you paid a premium for a number that does not move.
        Buy time and materials when any of those is open, and only with a cap, a
        weekly burn report by workstream, and a two-week exit.
      </p>
      <p>
        Whichever you sign, spend the review time on the exclusions, the change
        order clause and the acceptance criteria rather than the headline
        figure. That is where the money actually moves. The three builds we
        publish sit on <Link href="/work">our work page</Link>, two labelled as
        reference builds rather than client engagements. And if the scope is not
        settled, say so when you <Link href="/contact">send us the brief</Link>{" "}
        &mdash; the honest answer may be that you should buy discovery first,
        from us or from anyone.
      </p>
    </ArticleLayout>
  );
}
