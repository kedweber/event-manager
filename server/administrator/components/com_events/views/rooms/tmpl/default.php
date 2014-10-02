<?= @helper('behavior.mootools'); ?>
<script src="media://lib_koowa/js/koowa.js" />

<div class="row-fluid">
	<form action="" method="get" class="-koowa-grid" data-toolbar=".toolbar-list">
		<table class="table table-striped">
			<thead>
				<tr>
					<th style="text-align: center;" width="1">
						<?= @helper('grid.checkall')?>
					</th>
					<th>
						<?= @helper('grid.sort', array('column' => 'title', 'title' => @text('Title'))); ?>
					</th>
					<th width="5%">
						<?= @helper('grid.sort', array('column' => 'order', 'title' => @text('Order'))); ?>
					</th>
					<th width="5%">
						<?= @helper('grid.sort', array('column' => 'enabled', 'title' => @text('Enabled'))); ?>
					</th>
				</tr>
			</thead>

			<tfoot>
				<tr>
					<td colspan="6">
						<?= @helper('paginator.pagination', array('total' => $total)) ?>
					</td>
				</tr>
			</tfoot>

			<tbody>
				<? foreach ($rooms as $room) : ?>
					<tr>
						<td style="text-align: center;">
							<?= @helper('grid.checkbox', array('row' => $room))?>
						</td>
						<td>
							<a href="<?= @route('view=room&id='.$room->id); ?>">
								<?= $room->title; ?>
							</a>
						</td>
						<td>
							<?= @helper('grid.order', array('row' => $room, 'total' => $total)); ?>
						</td>
						<td>
							<?= @helper('grid.enable', array('row' => $room)); ?>
						</td>
					</tr>
				<? endforeach; ?>
				<? if (!count($rooms)) : ?>
					<tr>
						<td colspan="5" align="center" style="text-align: center;">
                            <?= @text('NO_ITEMS'); ?>
						</td>
					</tr>
				<? endif; ?>
			</tbody>
		</table>
	</form>
</div>